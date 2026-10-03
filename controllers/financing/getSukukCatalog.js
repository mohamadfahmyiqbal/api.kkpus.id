import db from "../../models/index.js";
import { Sequelize } from "sequelize";

const getSukukCatalog = async (req, res) => {
  try {
    const sukukList = await db.SukukIssue.findAll({
      where: { status: "OPEN" },
      order: [["end_date", "ASC"]],
      include: [
        {
          model: db.SukukOrder,
          as: "orders",
          attributes: [],
          where: { status: ["APPROVED", "PAID"] },
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COALESCE", Sequelize.fn("SUM", Sequelize.col("orders.amount")), 0),
            "current_funding",
          ],
        ],
      },
      group: ["sukuk_issues.issue_id"],
    });

    const data = sukukList.map((item) => ({
      ...item.toJSON(),
      current_funding: parseFloat(item.getDataValue("current_funding") || 0),
    }));

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan katalog sukuk",
      data,
    });
  } catch (error) {
    console.error("Error in getSukukCatalog:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default getSukukCatalog;
