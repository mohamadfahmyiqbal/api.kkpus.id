import db from "../../models/index.js";

// Fetch Payment Fee Configs
export const getPaymentFeeConfigs = async (req, res) => {
  try {
    const configs = await db.PaymentFeeConfig.findAll({
      attributes: ["id", "payment_type", "payment_name", "fee_type", "flat_fee", "percentage_fee"],
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error("Error fetching payment fee configs:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil konfigurasi biaya admin",
      error: error.message,
    });
  }
};

// Update Payment Fee Configs
export const updatePaymentFeeConfigs = async (req, res) => {
  try {
    const { configs } = req.body; // Expecting [{ id, fee_type, flat_fee, percentage_fee }]

    if (!configs || !Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        message: "Format data tidak valid. Diharapkan array configs.",
      });
    }

    // Update each config
    const updatePromises = configs.map((conf) =>
      db.PaymentFeeConfig.update(
        { 
          fee_type: conf.fee_type,
          flat_fee: conf.flat_fee,
          percentage_fee: conf.percentage_fee
        },
        { where: { id: conf.id } }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Konfigurasi biaya admin berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating payment fee configs:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui konfigurasi biaya admin",
      error: error.message,
    });
  }
};
