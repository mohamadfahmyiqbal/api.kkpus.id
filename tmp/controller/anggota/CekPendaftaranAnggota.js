import MAnggota from "../../models/anggota/MAnggota.js";
import MAnggotaBank from "../../models/anggota/MAnggotaBank.js";
import MAnggotaDetail from "../../models/anggota/MAnggotaDetail.js";
import MAnggotaJob from "../../models/anggota/MAnggotaJob.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import fs from "fs/promises";
import { constants as fsConstants } from "fs";
import path from "path";
import { MApproval, MApprovalFlow } from "../../models/index.js";

const toPlain = (rec) => {
  if (!rec) return null;
  if (typeof rec.toJSON === "function") return rec.toJSON();
  if (typeof rec.get === "function") return rec.get({ plain: true });
  return rec;
};

const fileExists = async (p) => {
  console.log(p);

  try {
    await fs.access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const readFileBase64IfExists = async (p) => {
  try {
    const exists = await fileExists(p);
    if (!exists) return null;
    const buf = await fs.readFile(p);
    return buf.toString("base64");
  } catch (err) {
    // jika gagal baca file, kembalikan null (jangan crash)
    console.warn(`Gagal baca file ${p}:`, err?.message ?? err);
    return null;
  }
};

export const CekPendaftaranAnggota = async (req, res) => {
  try {
    // Validasi input
    const rawNik = req.body?.nik;
    if (!rawNik || String(rawNik).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "NIK wajib diisi.",
      });
    }
    const nik = String(rawNik).trim();

    // Query paralel ke DB
    const [
      anggotaRecord,
      detailRecord,
      jobRecord,
      bankRecord,
      approvalFlowsRecord,
      approvalRequestRecord,
    ] = await Promise.all([
      MAnggota.findOne({
        where: { nik },
        attributes: { exclude: ["password", "token", "refreshToken"] },
      }),
      MAnggotaDetail.findOne({ where: { token: nik } }),
      MAnggotaJob.findOne({ where: { token: nik } }),
      MAnggotaBank.findOne({ where: { token: nik } }),
      MApprovalFlow.findAll({
        where: { type: "pendaftaran_anggota" },
        order: [["level", "ASC"]],
        include: [
          {
            model: MApproval,
            as: "approvals",
            required: false,
            include: [
              {
                model: MAnggota,
                as: "approver",
                required: false,
              },
            ],
          },
        ],
      }),
      MApprovalRequest.findOne({
        where: { requester_id: nik, type: "pendaftaran_anggota" },
      }),
    ]);

    if (!anggotaRecord) {
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    // Konversi ke plain objects
    const anggota = toPlain(anggotaRecord);
    const detailRaw = toPlain(detailRecord);
    const job = toPlain(jobRecord);
    const bank = toPlain(bankRecord);
    const approvalRequest = toPlain(approvalRequestRecord);
    const approvalFlows = Array.isArray(approvalFlowsRecord)
      ? approvalFlowsRecord.map((r) => {
          const flow = toPlain(r);
          if (Array.isArray(flow.approvals)) {
            flow.approvals = flow.approvals.map((a) => {
              const apr = toPlain(a);
              if (apr.approver) apr.approver = toPlain(apr.approver);
              return apr;
            });
          } else {
            flow.approvals = [];
          }
          return flow;
        })
      : [];

    // Status pendaftaran (prioritas: approvalRequest.status -> anggota.status_anggota -> default)
    const statusPendaftaran =
      approvalRequest?.status ?? anggota?.status_anggota ?? "belum diajukan";

    // Baca foto/ktp secara async jika ada di detail
    let detail = detailRaw;

    if (detail) {
      const fotoPath = detail.foto
        ? path.resolve(process.cwd(), detail.foto.replace(/^\//, ""))
        : null;
      const ktpPath = detail.ktp
        ? path.resolve(process.cwd(), detail.ktp.replace(/^\//, ""))
        : null;

      // baca paralel
      const [foto_base64, ktp_base64] = await Promise.all([
        fotoPath ? readFileBase64IfExists(fotoPath) : null,
        ktpPath ? readFileBase64IfExists(ktpPath) : null,
      ]);

      detail = {
        ...detail,
        foto_url: foto_base64,
        ktp_url: ktp_base64,
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        anggota,
        detail,
        job,
        bank,
        approvalFlows,
        approvalRequest,
        statusPendaftaran,
      },
    });
  } catch (error) {
    console.error("CekPendaftaranAnggota error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error?.message ?? null,
    });
  }
};
