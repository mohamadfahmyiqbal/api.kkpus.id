import db from "../../models/index.js";

const createSukukIssue = async (req, res) => {
  try {
    const { 
      issue_name, total_amount, start_date, end_date, 
      status, issuer, type, coupon, min_investment, price 
    } = req.body;

    if (!issue_name || !total_amount || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Nama, Total Pendanaan, Tanggal Mulai, dan Tanggal Berakhir wajib diisi",
      });
    }

    const sukuk = await db.SukukIssue.create({
      issue_name,
      total_amount,
      start_date,
      end_date,
      status: status || 'OPEN',
      issuer: issuer || 'Koperasi Syariah',
      type: type || 'Sukuk Mudharabah',
      coupon,
      min_investment: min_investment || 0,
      price: price || 100.0,
    });

    return res.status(201).json({
      success: true,
      message: "Produk investasi berhasil dibuat",
      data: sukuk,
    });
  } catch (error) {
    console.error("Error in createSukukIssue:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default createSukukIssue;
