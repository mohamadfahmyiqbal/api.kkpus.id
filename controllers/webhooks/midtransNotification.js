import db from "../../models/index.js";
import crypto from "crypto";

const { 
  Bill, 
  BillItem,
  Transaction, 
  Member, 
  Account, 
  MemberSavingsAccount,
  SavingsProduct,
  MemberRegistration 
} = db;

export const midtransNotification = async (req, res) => {
  const notification = req.body;

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const combinedStr = notification.order_id + notification.status_code + notification.gross_amount + serverKey;
  const signatureKey = crypto.createHash("sha512").update(combinedStr).digest("hex");

  if (signatureKey !== notification.signature_key) {
    return res.status(403).json({ message: "Invalid Signature Key" });
  }

  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const grossAmount = parseFloat(notification.gross_amount);

  let dbTransaction;
  try {
    dbTransaction = await db.sequelize.transaction();

    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: dbTransaction,
    });

    if (!localTx) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    let newStatus = (transactionStatus === "settlement" || transactionStatus === "capture") ? "PAID" : "EXPIRED";

    // 1. Update Status Transaksi
    await localTx.update({
      status: newStatus,
      settlement_time: newStatus === "PAID" ? new Date() : null,
    }, { transaction: dbTransaction });

    // 2. Update Status Tagihan
    if (localTx.bill_id) {
      await Bill.update(
        { status: newStatus === "PAID" ? "PAID" : "UNPAID" },
        { where: { bill_id: localTx.bill_id }, transaction: dbTransaction }
      );
    }

    // 3. LOGIKA MUTASI SALDO (Hanya jika PAID)
    if (newStatus === "PAID" && !localTx.is_ledger_recorded) {
      
      // A. Update Saldo Induk (Total Semua Simpanan)
      let [userAccount] = await Account.findOrCreate({
        where: { member_id: localTx.member_id, account_type: "SAVINGS" },
        defaults: {
          account_no: `ACC-${localTx.member_id}-${Date.now().toString().slice(-4)}`,
          current_balance: 0,
          open_date: new Date(),
        },
        transaction: dbTransaction,
      });
      await userAccount.increment("current_balance", { by: grossAmount, transaction: dbTransaction });

      // B. LOGIKA PECAH SALDO & PEMBUATAN AKUN
      if (localTx.tx_category === "MEMBER_REGISTRATION" && localTx.bill_id) {
        const items = await BillItem.findAll({
          where: { bill_id: localTx.bill_id },
          transaction: dbTransaction
        });

        // Loop item tagihan (Pokok/Wajib)
        for (const item of items) {
          let productName = item.description.includes("Pokok") ? "Simpanan Pokok" : 
                            item.description.includes("Wajib") ? "Simpanan Wajib" : "Simpanan Sukarela";

          const product = await SavingsProduct.findOne({
            where: { name: productName },
            transaction: dbTransaction
          });

          if (product) {
            let [savAcc, created] = await MemberSavingsAccount.findOrCreate({
              where: { member_id: localTx.member_id, savings_product_id: product.savings_product_id },
              defaults: {
                account_no: `SAV-${product.product_code || 'PRD'}-${localTx.member_id}`,
                account_type: productName,
                open_date: new Date(),
                current_balance: 0,
                status: 'ACTIVE'
              },
              transaction: dbTransaction,
            });
            await savAcc.increment("current_balance", { by: item.amount, transaction: dbTransaction });
          }
        }

        // --- 🆕 LOGIKA KHUSUS: Pastikan Akun Sukarela Selalu Ada (Saldo 0 jika tidak ada di tagihan) ---
        const sukarelaProduct = await SavingsProduct.findOne({
          where: { name: "Simpanan Sukarela" },
          transaction: dbTransaction
        });

        if (sukarelaProduct) {
          await MemberSavingsAccount.findOrCreate({
            where: { member_id: localTx.member_id, savings_product_id: sukarelaProduct.savings_product_id },
            defaults: {
              account_no: `SAV-SR-${localTx.member_id}`,
              account_type: "Simpanan Sukarela",
              open_date: new Date(),
              current_balance: 0,
              status: 'ACTIVE'
            },
            transaction: dbTransaction,
          });
        }

        // C. UPDATE STATUS MEMBER & REGISTRASI
        const registration = await MemberRegistration.findOne({
          where: { member_id: localTx.member_id },
          transaction: dbTransaction
        });

        if (registration) {
          await registration.update({ registration_status: "SELESAI" }, { transaction: dbTransaction });
          
          // Cari ID Status berdasarkan Nama Tipe Member (FULL/ASSOCIATE)
          const targetStatus = await db.MemberStatus.findOne({
            where: { status_name: registration.member_type },
            transaction: dbTransaction
          });

          if (targetStatus) {
            await Member.update(
              { status_id: targetStatus.status_id }, 
              { where: { member_id: localTx.member_id }, transaction: dbTransaction }
            );
          }
        }

      } else {
        // Logika untuk Topup Sukarela biasa
        const product = await SavingsProduct.findOne({
          where: { name: "Simpanan Sukarela" },
          transaction: dbTransaction
        });

        if (product) {
          let [savAcc, created] = await MemberSavingsAccount.findOrCreate({
            where: { member_id: localTx.member_id, savings_product_id: product.savings_product_id },
            defaults: {
              account_no: `SAV-SR-${localTx.member_id}`,
              account_type: "Simpanan Sukarela",
              open_date: new Date(),
              current_balance: 0,
              status: 'ACTIVE'
            },
            transaction: dbTransaction,
          });
          await savAcc.increment("current_balance", { by: grossAmount, transaction: dbTransaction });
        }
      }

      await localTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();
    return res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error("WEBHOOK_ERROR:", error);
    if (dbTransaction) await dbTransaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};