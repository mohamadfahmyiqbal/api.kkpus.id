// 📁 controllers/savings/getAccountDetail.js
import db from "../../models/index.js";

export const getAccountDetail = async (req, res) => {
  try {
    const memberId = req.userId;
    let { category } = req.query;

    // Validasi query parameter category
    if (!category) {
      category = "SS_SUKARELA";
    } else if (typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "Kategori simpanan harus berupa string."
      });
    }

    // Fallback jika category terkirim sebagai serialized array index oleh Axios (?0=S&1=S...)
    if (!category && req.query['0']) {
      category = Object.keys(req.query)
        .filter((k) => !isNaN(k))
        .sort((a, b) => a - b)
        .map((k) => req.query[k])
        .join('');
    }

    if (!category) {
      category = "SS_SUKARELA";
    }

    const member = await db.Member.findByPk(memberId, {
      attributes: ["member_id", "member_no", "full_name"],
    });

    // 1. Cari produk simpanan berdasarkan code atau fallback keyword
    let product = null;
    if (category) {
      product = await db.SavingsProduct.findOne({
        where: { product_code: category }
      });
      if (!product) {
        const catUpper = category.toUpperCase();
        let codeSearch = null;
        if (catUpper.includes("POKOK")) codeSearch = "SW_POKOK";
        else if (catUpper.includes("WAJIB")) codeSearch = "SW_WAJIB";
        else if (catUpper.includes("SUKARELA")) codeSearch = "SS_SUKARELA";
        if (codeSearch) {
          product = await db.SavingsProduct.findOne({ where: { product_code: codeSearch } });
        }
      }
    }

    // 2. Ambil data Akun Utama Simpanan berdasarkan Member dan Produk
    let account = null;
    if (product) {
      account = await db.MemberSavingsAccount.findOne({
        where: {
          member_id: memberId,
          savings_product_id: product.savings_product_id
        },
        include: [
          {
            model: db.Member,
            as: "member",
            attributes: ["full_name", "member_no"],
          },
          {
            model: db.SavingsProduct,
            as: "savingsProduct",
            attributes: ["name", "akad_type", "product_code", "savings_product_id"],
          },
        ],
        attributes: ["savings_account_id", "current_balance", "account_no", "savings_product_id"],
      });
    }

    // 3. Hitung saldo dan fallback jika account belum ada atau saldonya 0
    let finalBalance = parseFloat(account?.current_balance || 0);

    if (finalBalance === 0) {
      let targetType = null;
      const catUpper = (category || product?.product_code || "").toUpperCase();
      if (catUpper.includes("POKOK")) targetType = "POKOK";
      else if (catUpper.includes("WAJIB")) targetType = "WAJIB";
      else if (catUpper.includes("SUKARELA")) targetType = "SUKARELA";

      // Fallback 1: db.Savings (data import atau transaksi langsung)
      let savingsSum = 0;
      if (db.Savings && targetType) {
        savingsSum = (await db.Savings.sum("amount", {
          where: {
            member_id: memberId,
            savings_type: targetType,
            status: { [db.Sequelize.Op.in]: ["COMPLETED", "APPROVED"] }
          }
        })) || 0;
      }

      // Fallback 2: db.Account (ledger)
      let ledgerBalance = 0;
      if (db.Account && (category || product?.product_code)) {
        const ledgerAcc = await db.Account.findOne({
          where: {
            member_id: memberId,
            account_type: category || product?.product_code
          }
        });
        if (ledgerAcc) ledgerBalance = parseFloat(ledgerAcc.current_balance || 0);
      }

      finalBalance = ledgerBalance || parseFloat(savingsSum || 0);
    }

    // 4. Nomor Rekening
    const memberNo = member?.member_no || memberId.substring(0, 8);
    const prodCode = product?.product_code || category || "SAV";
    const defaultAccountNo = `SAV-${prodCode}-${memberNo}`;
    const accountNo = account?.account_no && account.account_no !== "-" ? account.account_no : defaultAccountNo;

    // 5. Auto-sync ke MemberSavingsAccount jika ada saldo tapi belum tersimpan
    if (product && finalBalance > 0) {
      try {
        if (!account) {
          account = await db.MemberSavingsAccount.create({
            member_id: memberId,
            savings_product_id: product.savings_product_id,
            account_no: accountNo,
            account_type: product.name,
            open_date: new Date(),
            current_balance: finalBalance
          });
        } else if (parseFloat(account.current_balance || 0) === 0) {
          await account.update({
            current_balance: finalBalance,
            account_no: accountNo
          });
        }
      } catch (syncErr) {
        console.warn("Auto-sync MemberSavingsAccount warning:", syncErr.message);
      }
    }

    // 6. Jika kategori adalah POKOK, cari daftar Bill Item ID
    let billItemIds = [];
    if (category === "SW_POKOK" || category === "POKOK" || prodCode === "SW_POKOK") {
      const transaction = await db.Transaction.findOne({
        where: {
          member_id: memberId,
          tx_category: "MEMBER_REGISTRATION",
        },
        attributes: ["bill_id"],
        order: [["created_at", "DESC"]],
      });

      if (transaction && transaction.bill_id) {
        const items = await db.BillItem.findAll({
          where: { bill_id: transaction.bill_id },
          attributes: ["bill_item_id"],
        });
        billItemIds = items.map(item => item.bill_item_id);
      }
    }

    // 7. Gabungkan Data Response
    const formattedData = {
      member_name: account?.member?.full_name || member?.full_name || "Anggota",
      balance: finalBalance,
      account_no: accountNo,
      product_name: account?.savingsProduct?.name || product?.name || "Simpanan",
      akad: account?.savingsProduct?.akad_type || product?.akad_type || "Wadi'ah",
      billItemIds: billItemIds 
    };

    return res.status(200).json({ status: true, data: formattedData });
  } catch (error) {
    console.error("Error getAccountDetail:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};
