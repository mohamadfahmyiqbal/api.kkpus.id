import db from "../../models/index.js";

export const deductStockFromInventory = async (req, res) => {
  const { stockId } = req.params;
  const userId = req.user?.id;
  
  const stockRecord = await db.Stock.findByPk(stockId);
  if (!stockRecord) {
    return res.status(404).json({
      status: false,
      message: "Stok tidak ditemukan"
    });
  }
  
  const deductionQty = 1;
  if (stockRecord.stock < deductionQty) {
    return res.status(400).json({
      status: false,
      message: "Stok tidak mencukupi"
    });
  }
  
  await stockRecord.decrement('stock', { by: deductionQty });
  await stockRecord.save();
  
  return res.status(200).json({
    status: true,
    message: "Transaksi berhasil - stok dikurangi",
    data: {
      stock_id: stockRecord.id,
      remaining_stock: stockRecord.stock - deductionQty,
      user_id: userId
    }
  });
};