import db from "../../models/index.js";
import { CONFIGURABLE_TYPE_CODES, parseNonNegativeAmount } from "./configValidation.js";

// Fetch Simpanan Config
export const getSimpananConfig = async (req, res) => {
  try {
    const config = await db.BillType.findAll({
      where: {
        type_code: CONFIGURABLE_TYPE_CODES,
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
    });
  }
};

// Update Simpanan Config
export const updateSimpananConfig = async (req, res) => {
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
      const amount = parseNonNegativeAmount(conf?.default_amount);
      if (!conf?.bill_type_id || amount === null) {
        return res.status(400).json({
          success: false,
          message: "Nominal tidak valid",
        });
      }
      parsedConfigs.push({ bill_type_id: conf.bill_type_id, default_amount: amount });
    }

    const transaction = await db.sequelize.transaction();
    try {
      for (const conf of parsedConfigs) {
        const billType = await db.BillType.findOne({
          where: {
            bill_type_id: conf.bill_type_id,
            type_code: CONFIGURABLE_TYPE_CODES,
          },
          transaction,
        });

        if (!billType) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Tipe simpanan tidak dapat diubah",
          });
        }

        const previousAmount = billType.default_amount;
        await billType.update({ default_amount: conf.default_amount }, { transaction });

        console.info("[config] simpanan amount updated", {
          actor: req.userId || null,
          billTypeId: conf.bill_type_id,
          typeCode: billType.type_code,
          from: previousAmount,
          to: conf.default_amount,
        });
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Konfigurasi simpanan berhasil diperbarui",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error updating simpanan config:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui konfigurasi simpanan",
    });
  }
};
