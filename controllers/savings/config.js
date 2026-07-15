import db from "../../models/index.js";

// Fetch Simpanan Config
export const getSimpananConfig = async (req, res) => {
  try {
    const config = await db.BillType.findAll({
      where: {
        type_code: ["SW_POKOK", "SW_WAJIB"],
      },
      attributes: ["bill_type_id", "type_code", "type_name", "default_amount"],
    });

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error fetching simpanan config:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil konfigurasi simpanan",
      error: error.message,
    });
  }
};

// Update Simpanan Config
export const updateSimpananConfig = async (req, res) => {
  try {
    const { configs } = req.body; // Expecting [{ bill_type_id, default_amount }]

    if (!configs || !Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        message: "Format data tidak valid. Diharapkan array configs.",
      });
    }

    // Update each config
    const updatePromises = configs.map((conf) =>
      db.BillType.update(
        { default_amount: conf.default_amount },
        { where: { bill_type_id: conf.bill_type_id } }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Konfigurasi simpanan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating simpanan config:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui konfigurasi simpanan",
      error: error.message,
    });
  }
};
