import db from "../../models/index.js";
import { parsePaymentFeeInput } from "../savings/configValidation.js";

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
    });
  }
};

// Update Payment Fee Configs
export const updatePaymentFeeConfigs = async (req, res) => {
  try {
    const { configs } = req.body;

    if (!configs || !Array.isArray(configs) || configs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Format data tidak valid. Diharapkan array configs.",
      });
    }

    const parsedConfigs = [];
    for (const conf of configs) {
      const parsed = parsePaymentFeeInput(conf);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          message: "Data biaya admin tidak valid",
        });
      }
      parsedConfigs.push(parsed);
    }

    const transaction = await db.sequelize.transaction();
    try {
      for (const parsed of parsedConfigs) {
        const existing = await db.PaymentFeeConfig.findByPk(parsed.id, { transaction });
        if (!existing) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Konfigurasi biaya tidak ditemukan",
          });
        }

        await existing.update(
          {
            fee_type: parsed.fee_type,
            flat_fee: parsed.flat_fee,
            percentage_fee: parsed.percentage_fee,
          },
          { transaction }
        );

        console.info("[config] payment fee updated", {
          actor: req.userId || null,
          id: parsed.id,
          feeType: parsed.fee_type,
          flatFee: parsed.flat_fee,
          percentageFee: parsed.percentage_fee,
        });
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Konfigurasi biaya admin berhasil diperbarui",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error updating payment fee configs:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui konfigurasi biaya admin",
    });
  }
};
