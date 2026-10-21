import db from "../../../models/index.js";
import { Op } from "sequelize";

const { Transaction, Member, Bill, BillItem } = db;

/**
 * Controller untuk melihat daftar transaksi manual yang menunggu verifikasi
 * Mendukung filter:
 * - status (default: PENDING_VERIFICATION)
 * - module / category (misal: simpanan, jualbeli, program, tabungan, investasi)
 */
export const getPendingVerificationPayments = async (req, res) => {
  try {
    const { status, module, category } = req.query;

    const whereClause = {
      payment_type: "manual_transfer",
    };

    if (status && status !== "ALL") {
      whereClause.status = status;
    } else if (!status) {
      whereClause.status = { [Op.in]: ["PENDING_VERIFICATION", "PENDING"] };
    }

    if (category) {
      whereClause.tx_category = category;
    } else if (module) {
      const mod = module.toLowerCase();
      if (mod === "simpanan") {
        whereClause.tx_category = {
          [Op.in]: [
            "SIMPANAN_POKOK",
            "SIMPANAN_WAJIB",
            "SIMPANAN_SUKARELA",
            "DEPOSIT_SUKARELA",
            "SAVINGS_DEPOSIT",
            "SETORAN_SIMPANAN",
            "SW_WAJIB",
            "SW_POKOK",
            "SS_SUKARELA",
            "SETORAN_MANUAL",
            "SETORAN",
          ],
        };
      } else if (mod === "jualbeli") {
        whereClause.tx_category = {
          [Op.in]: [
            "JUAL_BELI",
            "TRANSACTION_INSTALLMENT",
            "TRANSACTION_DOWN_PAYMENT",
            "DP_PEMBIAYAAN",
            "SETORAN_JUAL_BELI",
          ],
        };
      } else if (mod === "program" || mod === "pinjaman" || mod === "arisan") {
        whereClause.tx_category = {
          [Op.in]: [
            "PROGRAM_PEMBIAYAAN",
            "PINJAMAN_LUNAK",
            "ARISAN",
            "SETORAN_ARISAN",
            "SETORAN_PINJAMAN",
            "FINANCING_PAYMENT",
          ],
        };
      } else if (mod === "tabungan") {
        whereClause.tx_category = {
          [Op.in]: ["TABUNGAN", "SETORAN_TABUNGAN", "SAVING_TARGET_DEPOSIT"],
        };
      } else if (mod === "investasi") {
        whereClause.tx_category = {
          [Op.in]: [
            "INVESTASI_HALAL",
            "SUKUK",
            "PENDANAAN_SYARIAH",
            "SETORAN_INVESTASI",
          ],
        };
      }
    }

    const list = await Transaction.findAll({
      where: whereClause,
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["member_id", "member_no", "full_name", "email", "phone_number"],
        },
        {
          model: Bill,
          as: "bill",
          include: [
            {
              model: BillItem,
              as: "items",
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    return res.status(200).json({
      status: true,
      data: list,
    });
  } catch (error) {
    console.error("GET_PENDING_VERIFICATION_ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal mengambil daftar pembayaran manual.",
      error: error.message,
    });
  }
};
