import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import MNotification from "../../models/notifikasi/MNotification.js";
import { generateInvoice } from "../invoice/generateInvoice.js";
import { getApprovalRequestByNikToken } from "./getApprovalRequestByNikToken.js";

export const manageApproval = async (req, res) => {
  try {
    const { nik, nama } = req.anggota;
    const { btn, token } = req.body;

    // 🔹 Validasi parameter
    if (!btn || !token) {
      return res
        .status(400)
        .json({ message: "Parameter btn dan token wajib diisi." });
    }

    if (!["approved", "rejected"].includes(btn)) {
      return res.status(400).json({ message: "Status approval tidak valid." });
    }

    // 🔹 Ambil data approval berdasarkan token & nik
    const getApproval = await getApprovalRequestByNikToken({
      body: { ret: "ret", token, nik },
    });

    if (!getApproval) {
      return res
        .status(404)
        .json({ message: "Approval request tidak ditemukan." });
    }

    // 🔹 Pastikan user yang login adalah approver
    if (getApproval.approverAnggota?.nik !== nik) {
      return res
        .status(403)
        .json({ message: "Anda tidak berhak melakukan approval ini." });
    }

    // 🔹 Jika flow terakhir (misalnya flow = 2), generate invoice
    if (getApproval.flow === 2 && btn === "approved") {
      try {
        await generateInvoice({
          body: {
            ret: "ret",
            type: "pendaftaran_anggota",
            token,
          },
        });
      } catch (err) {
        console.error("Gagal generate invoice:", err);
        return res.status(500).json({ message: "Gagal generate invoice." });
      }
    }

    // 🔹 Update approval request
    const [updated] = await MApprovalRequest.update(
      {
        status: btn,
        updated_at: new Date(),
      },
      { where: { id: getApproval.id } }
    );

    if (updated === 0) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui approval request." });
    }

    // 🔹 Tambahkan notifikasi ke pemilik request
    await MNotification.create({
      user_id: getApproval.requester_id,
      title: `Request ${btn}`,
      message: `Request dengan token ${token} telah ${btn} oleh ${nama}`,
      status: "unread",
    });

    return res.status(200).json({
      message: `Approval berhasil di-${btn}`,
      approval: { id: getApproval.id, status: btn },
    });
  } catch (error) {
    console.error("Error manageApproval:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};
