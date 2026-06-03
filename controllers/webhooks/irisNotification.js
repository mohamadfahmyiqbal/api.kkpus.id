// 📁 controllers/webhooks/irisNotification.js
import db from "../../models/index.js";

export const irisNotification = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { 
      reference_no, 
      status, 
      error_message, 
      amount,
      beneficiary_name 
    } = req.body;

    if (!reference_no) {
      return res.status(400).json({ message: "Reference number is required" });
    }

    const withdrawal = await db.Withdrawal.findOne({
      where: { reference_no },
      include: [{ model: db.Member, as: "member" }],
      transaction
    });

    if (!withdrawal) {
      await transaction.rollback();
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedStatus = status === "completed" ? "success" : "failed";

    await withdrawal.update({
      status: updatedStatus,
      raw_gateway_response: JSON.stringify(req.body),
      remark: error_message || `Payout to ${beneficiary_name} ${status}`
    }, { transaction });

    if (updatedStatus === "failed") {
      const account = await db.Account.findOne({
        where: { member_id: withdrawal.member_id },
        transaction
      });

      if (account) {
        await account.increment("current_balance", { 
          by: parseFloat(amount), 
          transaction 
        });
      }
    }

    await transaction.commit();

    if (req.io) {
      req.io.emit("TRANSACTION_UPDATED", {
        member_id: withdrawal.member_id,
        reference_no,
        status: updatedStatus
      });
    }

    return res.status(200).json({ status: "OK" });

  } catch (error) {
    await transaction.rollback();
    console.error("Iris Webhook Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};