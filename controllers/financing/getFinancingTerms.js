import db from "../../models/index.js";

const getFinancingTerms = async (req, res) => {
  try {
    const terms = await db.FinancingTerm.findAll({
      where: { is_active: true },
      order: [["value_months", "ASC"]],
      attributes: ["term_id", "label", "value_months"]
    });

    return res.status(200).json({
      status: true,
      data: terms
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export default getFinancingTerms;