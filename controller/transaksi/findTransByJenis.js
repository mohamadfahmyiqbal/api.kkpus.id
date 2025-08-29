import MTrans from "../../models/transaksi/MTrans.js";

export const findTransByJenis = async (req, res) => {
  const { ret, jenis } = req.body;

  try {
    const find = await MTrans.findAll({
      raw: true,
      nest: true,
      where: {
        jenis,
      },
    });

    if (ret === "ret") {
      return find;
    }
  } catch (err) {
    console.log(err);
  }
};
