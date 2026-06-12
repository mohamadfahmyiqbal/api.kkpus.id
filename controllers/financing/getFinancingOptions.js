import db from "../../models/index.js";

const getFinancingOptions = async (req, res) => {
  try {
    const [categories, terms] = await Promise.all([
      db.FinancingCategory.findAll({ 
        where: { is_active: true },
        attributes: ['category_name'] 
      }),
      db.FinancingTerm.findAll({ 
        where: { is_active: true }, 
        order: [['value_months', 'ASC']],
        attributes: ['label', 'value_months', 'persentase_anggota', 'persentase_reguler']
      })
    ]);

    return res.status(200).json({
      status: true,
      data: {
        categories: categories.map(c => c.category_name),
        terms: terms.map(t => ({ 
          label: t.label, 
          value: String(t.value_months),
          persentase_anggota: parseFloat(t.persentase_anggota),
          persentase_reguler: parseFloat(t.persentase_reguler)
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};

export default getFinancingOptions;