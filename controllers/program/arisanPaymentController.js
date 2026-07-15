import db from "../../models/index.js";

const { ArisanPayment, Member, ArisanBatch } = db;

export const getPaymentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const payments = await ArisanPayment.findAll({
      where: { arisan_batch_id: batchId },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['member_id', 'member_no', 'full_name', 'phone_number']
        }
      ],
      order: [['payment_month', 'ASC'], ['created_at', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error("Error getPaymentsByBatch:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { member_id, payment_month, amount, status } = req.body;

    let payment = await ArisanPayment.findOne({
      where: { arisan_batch_id: batchId, member_id, payment_month }
    });

    if (payment) {
      payment.amount = amount || payment.amount;
      payment.status = status || payment.status;
      if (status === 'PAID' && payment.status !== 'PAID') {
        payment.payment_date = new Date();
      }
      await payment.save();
    } else {
      payment = await ArisanPayment.create({
        arisan_batch_id: batchId,
        member_id,
        payment_month,
        amount,
        status: status || 'PENDING',
        payment_date: status === 'PAID' ? new Date() : null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: payment
    });
  } catch (error) {
    console.error("Error recordPayment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
