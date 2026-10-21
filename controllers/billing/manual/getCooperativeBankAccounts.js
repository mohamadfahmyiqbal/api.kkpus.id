import db from "../../../models/index.js";

const { CooperativeBankAccount } = db;

/**
 * Controller untuk mengambil daftar rekening bank koperasi aktif
 */
export const getCooperativeBankAccounts = async (req, res) => {
  try {
    const accounts = await CooperativeBankAccount.findAll({
      where: { is_active: true },
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      data: accounts,
    });
  } catch (error) {
    console.error("GET_COOP_BANKS_ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal mengambil daftar rekening koperasi.",
      error: error.message,
    });
  }
};
