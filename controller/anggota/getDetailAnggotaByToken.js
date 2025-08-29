import MAnggota from "../../models/anggota/MAnggota.js";
import MAnggotaBank from "../../models/anggota/MAnggotaBank.js";
import MAnggotaDetail from "../../models/anggota/MAnggotaDetail.js";
import MAnggotaJob from "../../models/anggota/MAnggotaJob.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";

export const getDetailAnggotaByToken = async (req, res) => {
  let token = null;

  // Ambil token dari cookie jika ada, jika tidak dari header Authorization (tanpa Bearer)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization; // langsung ambil tanpa "Bearer"
  }
  const { ret } = req.body || {};

  try {
    // Cari user berdasarkan token
    const user = await MAnggota.findOne({
      where: { token },
      attributes: { exclude: ["password", "token"] },
    });

    if (!user) {
      const msg = { message: "Anggota tidak ditemukan" };
      if (ret === "ret") {
        return msg;
      }
      return res.status(404).json(msg);
    }

    // Optimasi: lakukan query detail, job, bank, approval secara paralel
    const [detail, job, bank, approval] = await Promise.all([
      MAnggotaDetail.findOne({ where: { token: user.nik } }),
      MAnggotaJob.findOne({ where: { token: user.nik } }),
      MAnggotaBank.findOne({ where: { token: user.nik } }),
      MApprovalRequest.findOne({
        where: { requester_id: user.nik, type: "pendaftaran_anggota" },
      }),
    ]);

    const result = {
      user,
      detail,
      job,
      bank,
      approval,
    };

    if (ret === "ret") {
      return result;
    }
    return res.status(200).json(result);
  } catch (error) {
    const msg = { message: `Server Error ${error}` };
    if (ret === "ret") {
      return msg;
    }
    return res.status(500).json(msg);
  }
};
