import db from "../../../models/index.js";

const { Account, BillItem, FinancingApplication, Sequelize } = db;

export const getFinancialSummary = async (req, res) => {
  try {
    const memberId = req.userId; // Diambil dari middleware autentikasi

    // Ambil akun yang relevan dengan simpanan pokok, wajib, sukarela, dan tabungan
    const savingsAccounts = await Account.findAll({
      where: {
        member_id: memberId,
        account_type: ["SW_POKOK", "SW_WAJIB", "SS_SUKARELA", "TABUNGAN_DEPOSIT"],
      },
    });

    // Kalkulasi total saldo simpanan (Hanya Pokok, Wajib, Sukarela seperti rule sebelumnya)
    let totalSavings = 0;
    const details = [];

    const nameMap = {
      "SW_POKOK": "Simpanan Pokok",
      "SW_WAJIB": "Simpanan Wajib",
      "SS_SUKARELA": "Simpanan Sukarela",
      "TABUNGAN_DEPOSIT": "Tabungan"
    };

    savingsAccounts.forEach(acc => {
      const balance = parseFloat(acc.current_balance || 0);
      details.push({
        type: acc.account_type,
        name: nameMap[acc.account_type] || acc.account_type,
        balance: balance
      });

      if (["SW_POKOK", "SW_WAJIB", "SS_SUKARELA"].includes(acc.account_type)) {
        totalSavings += balance;
      }
    });

    const financingApps = await db.FinancingApplication.findAll({
      where: { member_id: memberId, status: "APPROVED" }
    });

    let totalJualBeli = 0;
    let totalTagihanPinjaman = 0;
    let totalNominalPinjaman = 0;
    let totalNominalCicilanPinjaman = 0;
    
    let totalArisanTagihan = 0;
    let arisanDiikutiCount = 0;

    const pinjamanIds = [];
    const jualBeliIds = [];

    financingApps.forEach(f => {
      const purpose = (f.purpose || '').toLowerCase();
      const itemName = (f.item_name || '').toLowerCase();
      
      if (purpose.startsWith('pinjaman')) {
        totalTagihanPinjaman += parseFloat(f.total_tagihan || 0);
        totalNominalPinjaman += parseFloat(f.amount_requested || f.nominal_kredit || 0);
        totalNominalCicilanPinjaman += parseFloat(f.monthly_installment || f.angsuran || 0);
        pinjamanIds.push(f.financing_id);
      } else if (itemName.includes('arisan') || purpose.includes('arisan')) {
        totalArisanTagihan += parseFloat(f.total_tagihan || f.amount_requested || f.item_price || 0);
        arisanDiikutiCount++;
      } else {
        totalJualBeli += parseFloat(f.total_tagihan || 0);
        jualBeliIds.push(f.financing_id);
      }
    });

    const allInstallments = await BillItem.findAll({
      where: {
        member_id: memberId,
        category_code: {
          [db.Sequelize.Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT']
        }
      }
    });

    let sisaCicilanJualBeli = 0;
    let sisaCicilanPinjaman = 0;
    let jumlahCicilanBelumDibayarJualBeli = 0;
    let terbayarPinjaman = 0;
    
    let sisaCicilanArisan = 0;
    let terbayarArisan = 0;

    allInstallments.forEach(item => {
      const desc = (item.description || '').toLowerCase();
      const isPinjaman = desc.includes('pinjaman');
      const isArisan = desc.includes('arisan');
      const amt = parseFloat(item.amount || 0);
      
      if (item.status === 'UNPAID') {
        if (isPinjaman) {
          sisaCicilanPinjaman += amt;
        } else if (isArisan) {
          sisaCicilanArisan += amt;
        } else {
          sisaCicilanJualBeli += amt;
          jumlahCicilanBelumDibayarJualBeli++;
        }
      } else if (item.status === 'PAID') {
        if (isPinjaman) {
          terbayarPinjaman += amt;
        } else if (isArisan) {
          terbayarArisan += amt;
        }
      }
    });

    let totalLoanDebt = 0; // Sementara 0 jika modul pinjaman belum ada
    let totalSHU = 0; // Sementara 0 jika modul SHU belum ada

    return res.status(200).json({
      success: true,
      message: "Data ringkasan keuangan berhasil diambil",
      data: {
        totalSavings: totalSavings,
        totalLoanDebt: totalTagihanPinjaman,
        totalSHU: totalSHU,
        totalJualBeli: totalJualBeli,
        sisaCicilanJualBeli: sisaCicilanJualBeli,
        jumlahCicilanBelumDibayar: jumlahCicilanBelumDibayarJualBeli,
        totalNominalPinjaman: totalNominalPinjaman,
        totalNominalCicilanPinjaman: totalNominalCicilanPinjaman,
        sisaCicilanPinjaman: sisaCicilanPinjaman,
        terbayarPinjaman: terbayarPinjaman,
        totalArisanTagihan: totalArisanTagihan,
        arisanDiikutiCount: arisanDiikutiCount,
        sisaCicilanArisan: sisaCicilanArisan,
        terbayarArisan: terbayarArisan,
        details: details
      },
    });
  } catch (error) {
    console.error("Financial Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil ringkasan keuangan.",
      error: error.message,
    });
  }
};
