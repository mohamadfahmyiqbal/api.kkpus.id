// path: controllers/core/anggota/getRegistrationStatus.js

import db from "../../../models/index.js";
import fs from "fs";


const { MemberRegistration, Member, MemberStatus, BillItem, ApprovalFlow, ApprovalStep, EntityStepApproval, Sequelize } = db;
const { Op } = Sequelize;

export const getRegistrationStatus = async (req, res) => {
  const member_id = req.userId;
  const BASE_URL = process.env.BASE_URL;

  try {
    const registrationData = await MemberRegistration.findOne({
      where: { member_id },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["member_id", "full_name", "is_registration_done"],
          include: [
            { 
              model: MemberStatus, 
              as: "status", 
              attributes: ["status_name"] 
            }
          ],
        },
        {
          model: ApprovalFlow,
          as: "flow",
          attributes: ["approval_flow_id", "flow_name", "entity_ref"],
          include: [
            {
              model: ApprovalStep,
              as: "steps",
              include: [
                {
                  model: EntityStepApproval,
                  as: "entityApprovals",
                  where: { entity_ref: 'members' },
                  required: false
                }
              ]
            }
          ]
        },
        {
          model: db.Approval,
          as: 'approvals',
          required: false
        }
      ],
      // Berdasarkan log error Anda, gunakan createdAt (CamelCase)
      order: [["createdAt", "DESC"]], 
    });

    if (!registrationData) {
      return res.status(200).json({ 
        status: true, 
        is_registration_done: false, 
        data: null 
      });
    }

    // FIX: Hapus registration_id karena kolom tidak ada di DB
    const activeBillItem = await BillItem.findOne({
      where: {
        member_id: member_id, // Hanya gunakan member_id
        bill_type_id: { [Op.in]: [1, 2] },
        status: 'UNPAID'
      },
      attributes: ["bill_id", "status", "amount", "bill_item_id"],
      // BillItem pakai created_at karena underscored: true di model
      order: [["created_at", "DESC"]] 
    });

    const responseData = registrationData.get({ plain: true });
    
    // Mapping untuk UI
    responseData.bill_id = activeBillItem?.bill_id || null;
    responseData.bill_item_id = activeBillItem?.bill_item_id || null;
    responseData.bill_status = activeBillItem ? "WAITING_PAYMENT" : "PAID";
    responseData.bill_amount = activeBillItem ? parseFloat(activeBillItem.amount) : 0;
    
    responseData.foto_ktp = responseData.ktp_photo_path ? `${BASE_URL}${responseData.ktp_photo_path.startsWith('/') ? '' : '/'}${responseData.ktp_photo_path}` : null;
    responseData.foto_swafoto = responseData.selfie_photo_path ? `${BASE_URL}${responseData.selfie_photo_path.startsWith('/') ? '' : '/'}${responseData.selfie_photo_path}` : null;

    // Mapping Wilayah ke Key Frontend
    responseData.provinsi = responseData.province_name;
    responseData.kota_kab = responseData.city_name;
    responseData.kecamatan = responseData.district_name;
    responseData.kelurahan = responseData.subdistrict_name;

    // Helper Approval berdasarkan step_order (1: Pengawas, 2: Ketua) untuk menghindari hardcode ID
    const isStepApprovedByOrder = (orderIndex) => {
      const step = responseData.flow?.steps?.find(s => s.step_order === orderIndex);
      const approval = step?.entityApprovals?.find(a => a.entity_id == registrationData.registration_id);
      return !!(approval && approval.is_approved === 1);
    };

    // Gunakan dari DB jika sudah ada, atau evaluasi dari ApprovalStep
    responseData.is_approved_pengawas = responseData.is_approved_pengawas || isStepApprovedByOrder(1);
    responseData.is_approved_ketua = responseData.is_approved_ketua || isStepApprovedByOrder(2);

    return res.status(200).json({
      status: true,
      is_registration_done: true,
      data: responseData,
    });

  } catch (error) {
    console.error("DEBUG_GET_REG_STATUS_ERROR:", error);
    try {
      fs.appendFileSync("api_error.log", `${new Date().toISOString()} - ERROR: ${error.stack}\n`);
    } catch (fsErr) {
      console.error("Failed to write to api_error.log:", fsErr);
    }
    return res.status(500).json({
      status: false,
      message: "Gagal memproses status pendaftaran.",
      error: error.message
    });
  }
};