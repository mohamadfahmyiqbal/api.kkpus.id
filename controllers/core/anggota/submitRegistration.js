// path: controllers/core/anggota/submitRegistration.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../../../models/index.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";

const {
  MemberRegistration,
  MemberBankAccount,
  MemberEmployment,
  MemberEmergencyContact,
  Member,
  MemberRoleAssignment,
  ApprovalFlow,
  ApprovalStep,
  ApprovalStatus,
  sequelize,
} = db;

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.join(path.dirname(__filename), "..", "..", "..");

const saveBase64Image = (base64Image, nik, fileType) => {
  if (!base64Image?.includes("base64,")) throw new Error(`Data foto ${fileType} tidak valid.`);
  const parts = base64Image.match(/^data:(image\/(jpeg|png|jpg));base64,(.*)$/);
  if (!parts) throw new Error(`Format file ${fileType} harus JPG/PNG.`);

  const mimeType = parts[1];
  const imageBuffer = Buffer.from(parts[3], "base64");
  const extension = mimeType.split("/")[1] === 'jpeg' ? 'jpg' : mimeType.split("/")[1];
  const uploadDir = path.join(rootDir, "public", "uploads", "anggota");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const publicPath = `uploads/anggota/${nik}_${fileType}_${Date.now()}.${extension}`;
  fs.writeFileSync(path.join(rootDir, "public", publicPath), imageBuffer);
  console.log(`File saved: ${path.join(rootDir, "public", publicPath)}`);
  return publicPath;
};

export const submitRegistration = async (req, res) => {
  const member_id = req.userId;
  let transaction;
  let tempPaths = [];

  try {
    const [checkMember, existingReg] = await Promise.all([
      Member.findByPk(member_id),
      MemberRegistration.findOne({ where: { member_id, final_status: 'PENDING' } })
    ]);

    if (!checkMember) return res.status(404).json({ status: false, message: "Member tidak ditemukan." });
    if (existingReg) return res.status(400).json({ status: false, message: "Pendaftaran sedang diproses." });

    if (!req.body.account_number && !req.body.bank_account_no) throw new Error("Nomor rekening wajib diisi.");
    if (!req.body.job_title && !req.body.occupation) throw new Error("Pekerjaan wajib diisi.");

    const ktpPath = saveBase64Image(req.body.foto_ktp, req.body.nik_ktp, "ktp");
    tempPaths.push(ktpPath);
    const swafotoPath = saveBase64Image(req.body.foto_swafoto, req.body.nik_ktp, "swafoto");
    tempPaths.push(swafotoPath);

    const flow = await ApprovalFlow.findOne({ 
      where: { entity_ref: "member_registrations" },
      attributes: ["approval_flow_id", "flow_name", "entity_ref", "created_at", "updated_at"]
    });
    
    if (!flow) throw new Error("Konfigurasi Flow Approval tidak ditemukan.");

    const [initialStep, statusInitial] = await Promise.all([
      ApprovalStep.findOne({
        where: { approval_flow_id: flow.approval_flow_id },
        order: [["step_order", "ASC"]],
      }),
      ApprovalStatus.findOne({
        where: { 
          approval_flow_id: flow.approval_flow_id, 
          status_code: "WAITING_APPROVAL" 
        }
      })
    ]);

    if (!initialStep) throw new Error("Langkah persetujuan awal belum dikonfigurasi.");
    if (!statusInitial) throw new Error("Status pendaftaran (WAITING_APPROVAL) tidak ditemukan.");

    transaction = await sequelize.transaction();

    const registration = await MemberRegistration.create({
      member_id,
      full_name: req.body.full_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      nik_ktp: req.body.nik_ktp,
      address_ktp: req.body.alamat_ktp,
      province_id: req.body.province_id,
      province_name: req.body.provinsi,
      city_id: req.body.city_id,
      city_name: req.body.kota_kab,
      district_id: req.body.district_id,
      district_name: req.body.kecamatan,
      subdistrict_id: req.body.subdistrict_id,
      subdistrict_name: req.body.kelurahan,
      rt: req.body.rt,
      rw: req.body.rw,
      member_type: req.body.tipeAnggota,
      ktp_photo_path: ktpPath,
      selfie_photo_path: swafotoPath,
      approval_flow_id: flow.approval_flow_id,
      current_step_id: initialStep.approval_step_id,
      status_id: statusInitial.approval_status_id,
      final_status: "PENDING",
      registered_at: new Date()
    }, { transaction });

    await Promise.all([
      MemberBankAccount.create({ 
        member_id, 
        bank_name: req.body.bank_name, 
        bank_account_no: req.body.account_number || req.body.bank_account_no, 
        account_holder: req.body.account_holder 
      }, { transaction }),
      MemberEmployment.create({ 
        member_id, 
        occupation: req.body.job_title || req.body.occupation, 
        employer_name: req.body.employer_name, 
        employer_address: req.body.employer_address 
      }, { transaction }),
      MemberEmergencyContact.create({ 
        member_id, 
        contact_name: req.body.contact_name, 
        phone_number: req.body.phone_number_emergency, 
        relation: req.body.relation 
      }, { transaction }),
      Member.update({ is_registration_done: 1 }, { where: { member_id }, transaction })
    ]);

    await transaction.commit();

    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: member_id,
          title: "Pendaftaran Berhasil",
          content: "Data Anda sedang diverifikasi.",
          type: "REGISTRATION_SUBMITTED"
        });
        const approvers = await MemberRoleAssignment.findAll({ where: { role_id: initialStep.role_id } });
        for (const admin of approvers) {
          await sendGlobalNotification({ 
            memberId: admin.member_id, 
            title: "Tugas Baru", 
            content: `Verifikasi pendaftaran: ${req.body.full_name}`, 
            type: "APPROVAL_TASK" 
          });
        }
      } catch (err) { console.error("Notification Error:", err); }
    });

    return res.status(201).json({ status: true, message: "Pendaftaran berhasil dikirim." });

  } catch (error) {
    console.log(error)
    // console.error("CRITICAL_ERROR: submitRegistration failed", {
    //   timestamp: new Date().toISOString(),
    //   userId: req.userId,
    //   errorName: error.name,
    //   errorMessage: error.message,
    //   payload: req.body
    // });

    if (transaction) await transaction.rollback();
    
    tempPaths.forEach(p => {
      const full = path.join(rootDir, "public", p);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    });

    return res.status(500).json({ status: false, message: error.message });
  }
};