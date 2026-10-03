import db from "../../models/index.js";

const getPinjamanReport = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Aggregation Query
    const query = `
      SELECT 
        m.member_id AS id,
        m.full_name AS nama,
        f.purpose AS keperluan,
        f.cooperation_months AS termin,
        f.status AS status,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_ini,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_ini,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_ini,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN (SELECT COALESCE(SUM(amount), 0) FROM bill_items WHERE financing_application_id = f.financing_id AND status = 'PAID' AND category_code = 'TRANSACTION_INSTALLMENT') ELSE 0 END) AS cicilan_ini,
        
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_lalu,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_lalu,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_lalu,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN (SELECT COALESCE(SUM(amount), 0) FROM bill_items WHERE financing_application_id = f.financing_id AND status = 'PAID' AND category_code = 'TRANSACTION_INSTALLMENT') ELSE 0 END) AS cicilan_lalu,
        
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_lalu2,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_lalu2,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_lalu2,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN (SELECT COALESCE(SUM(amount), 0) FROM bill_items WHERE financing_application_id = f.financing_id AND status = 'PAID' AND category_code = 'TRANSACTION_INSTALLMENT') ELSE 0 END) AS cicilan_lalu2
      FROM financing_applications f
      JOIN members m ON f.member_id = m.member_id
      WHERE f.purpose LIKE 'Pinjaman%' AND f.status IN ('APPROVED', 'ACTIVE', 'COMPLETED', 'BAD_DEBT')
      GROUP BY m.member_id, m.full_name, f.purpose, f.cooperation_months, f.status
    `;

    const results = await db.sequelize.query(query, {
      replacements: {
        currentYear: currentYear,
        lastYear: currentYear - 1,
        lastYear2: currentYear - 2
      },
      type: db.Sequelize.QueryTypes.SELECT
    });

    const listTotals = {
      tahun_ini: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
      tahun_lalu: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
      tahun_lalu2: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 }
    };

    const listData = results.map(row => {
      const pokok_ini = parseFloat(row.pokok_ini || 0);
      const dp_ini = parseFloat(row.dp_ini || 0);
      const margin_ini = parseFloat(row.margin_ini || 0);
      const cicilan_ini = parseFloat(row.cicilan_ini || 0);
      const total_ini = pokok_ini + margin_ini;

      const pokok_lalu = parseFloat(row.pokok_lalu || 0);
      const dp_lalu = parseFloat(row.dp_lalu || 0);
      const margin_lalu = parseFloat(row.margin_lalu || 0);
      const cicilan_lalu = parseFloat(row.cicilan_lalu || 0);
      const total_lalu = pokok_lalu + margin_lalu;

      const pokok_lalu2 = parseFloat(row.pokok_lalu2 || 0);
      const dp_lalu2 = parseFloat(row.dp_lalu2 || 0);
      const margin_lalu2 = parseFloat(row.margin_lalu2 || 0);
      const cicilan_lalu2 = parseFloat(row.cicilan_lalu2 || 0);
      const total_lalu2 = pokok_lalu2 + margin_lalu2;

      listTotals.tahun_ini.pokok += pokok_ini;
      listTotals.tahun_ini.dp += dp_ini;
      listTotals.tahun_ini.margin += margin_ini;
      listTotals.tahun_ini.cicilan += cicilan_ini;
      listTotals.tahun_ini.total += total_ini;

      listTotals.tahun_lalu.pokok += pokok_lalu;
      listTotals.tahun_lalu.dp += dp_lalu;
      listTotals.tahun_lalu.margin += margin_lalu;
      listTotals.tahun_lalu.cicilan += cicilan_lalu;
      listTotals.tahun_lalu.total += total_lalu;

      listTotals.tahun_lalu2.pokok += pokok_lalu2;
      listTotals.tahun_lalu2.dp += dp_lalu2;
      listTotals.tahun_lalu2.margin += margin_lalu2;
      listTotals.tahun_lalu2.cicilan += cicilan_lalu2;
      listTotals.tahun_lalu2.total += total_lalu2;

      return {
        id: row.id,
        nama: row.nama,
        keperluan: row.keperluan,
        termin: row.termin,
        status: row.status,
        tahun_ini: { total: total_ini, pokok: pokok_ini, dp: dp_ini, margin: margin_ini, cicilan: cicilan_ini },
        tahun_lalu: { total: total_lalu, pokok: pokok_lalu, dp: dp_lalu, margin: margin_lalu, cicilan: cicilan_lalu },
        tahun_lalu2: { total: total_lalu2, pokok: pokok_lalu2, dp: dp_lalu2, margin: margin_lalu2, cicilan: cicilan_lalu2 }
      };
    });

    // We need global totals for Jurnal (separated by Saldo Awal and Mutasi)
    const globalQuery = `
      SELECT 
        SUM(CASE WHEN YEAR(f.created_at) < :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS piutangPokokAwal,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS piutangPokokMutasi,
        SUM(CASE WHEN YEAR(f.created_at) < :currentYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS marginAwal,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS marginMutasi
      FROM financing_applications f
      WHERE f.purpose LIKE 'Pinjaman%' AND f.status IN ('APPROVED', 'ACTIVE', 'COMPLETED', 'BAD_DEBT')
    `;
    const globalResults = await db.sequelize.query(globalQuery, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const gd = globalResults[0] || {};
    const pKeluarAwal = parseFloat(gd.piutangPokokAwal || 0) + parseFloat(gd.marginAwal || 0);
    const pKeluarMutasi = parseFloat(gd.piutangPokokMutasi || 0) + parseFloat(gd.marginMutasi || 0);

    const dibayarQuery = `
      SELECT 
        SUM(CASE WHEN YEAR(b.updated_at) < :currentYear THEN b.amount ELSE 0 END) AS dibayarAwal,
        SUM(CASE WHEN YEAR(b.updated_at) = :currentYear THEN b.amount ELSE 0 END) AS dibayarMutasi
      FROM bill_items b
      JOIN financing_applications f ON b.financing_application_id = f.financing_id
      WHERE f.purpose LIKE 'Pinjaman%' AND b.status = 'PAID' AND b.category_code = 'TRANSACTION_INSTALLMENT'
    `;
    const dibayarResults = await db.sequelize.query(dibayarQuery, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const dd = dibayarResults[0] || {};
    const dLunasAwal = parseFloat(dd.dibayarAwal || 0);
    const dLunasMutasi = parseFloat(dd.dibayarMutasi || 0);

    const modalQuerySum = `
      SELECT 
        SUM(CASE WHEN YEAR(tanggal) < :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN -jumlah ELSE jumlah END) ELSE 0 END) AS modalAwal,
        SUM(CASE WHEN YEAR(tanggal) = :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN -jumlah ELSE jumlah END) ELSE 0 END) AS modalMutasi
      FROM pinjaman_modal_transactions
    `;
    const modalResultsSum = await db.sequelize.query(modalQuerySum, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const md = modalResultsSum[0] || {};
    const hSisaAwal = parseFloat(md.modalAwal || 0);
    const hSisaMutasi = parseFloat(md.modalMutasi || 0);

    const hutangQuerySum = `
      SELECT 
        SUM(CASE WHEN YEAR(tanggal) < :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN -jumlah ELSE jumlah END) ELSE 0 END) AS hutangAwal,
        SUM(CASE WHEN YEAR(tanggal) = :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN -jumlah ELSE jumlah END) ELSE 0 END) AS hutangMutasi
      FROM pinjaman_hutang_transactions
    `;
    const hutangResultsSum = await db.sequelize.query(hutangQuerySum, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const hd = hutangResultsSum[0] || {};
    const hutangAwal = parseFloat(hd.hutangAwal || 0);
    const hutangMutasi = parseFloat(hd.hutangMutasi || 0);

    const aktivaTetapQuerySum = `
      SELECT 
        SUM(CASE WHEN YEAR(tanggal) < :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN jumlah ELSE -jumlah END) ELSE 0 END) AS aktivaAwal,
        SUM(CASE WHEN YEAR(tanggal) = :currentYear THEN (CASE WHEN jenis = 'DEBET' THEN jumlah ELSE -jumlah END) ELSE 0 END) AS aktivaMutasi
      FROM pinjaman_aktiva_tetap_transactions
    `;
    const aktivaResultsSum = await db.sequelize.query(aktivaTetapQuerySum, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const ad = aktivaResultsSum[0] || {};
    const aktivaAwal = parseFloat(ad.aktivaAwal || 0);
    const aktivaMutasi = parseFloat(ad.aktivaMutasi || 0);

    const badDebtQuery = `
      SELECT 
        SUM(CASE WHEN YEAR(f.updated_at) < :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS principalAwal,
        SUM(CASE WHEN YEAR(f.updated_at) = :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS principalMutasi,
        (
          SELECT COALESCE(SUM(b.amount), 0)
          FROM bill_items b
          JOIN financing_applications fa ON b.financing_application_id = fa.financing_id
          WHERE fa.purpose LIKE 'Pinjaman%' AND fa.status = 'BAD_DEBT' AND b.status = 'PAID' AND b.category_code = 'TRANSACTION_INSTALLMENT' AND YEAR(b.updated_at) < :currentYear
        ) AS paidAwal,
        (
          SELECT COALESCE(SUM(b.amount), 0)
          FROM bill_items b
          JOIN financing_applications fa ON b.financing_application_id = fa.financing_id
          WHERE fa.purpose LIKE 'Pinjaman%' AND fa.status = 'BAD_DEBT' AND b.status = 'PAID' AND b.category_code = 'TRANSACTION_INSTALLMENT' AND YEAR(b.updated_at) = :currentYear
        ) AS paidMutasi
      FROM financing_applications f
      WHERE f.purpose LIKE 'Pinjaman%' AND f.status = 'BAD_DEBT'
    `;
    const bdResults = await db.sequelize.query(badDebtQuery, { replacements: { currentYear }, type: db.Sequelize.QueryTypes.SELECT });
    const bdd = bdResults[0] || {};
    const kerugianAwal = Math.max(0, parseFloat(bdd.principalAwal || 0) - parseFloat(bdd.paidAwal || 0));
    const kerugianMutasi = Math.max(0, parseFloat(bdd.principalMutasi || 0) - parseFloat(bdd.paidMutasi || 0));

    // Calculate Jurnal Variables
    const jurnal_saldo_awal = {
      kas: { debet: hSisaAwal + dLunasAwal, kredit: pKeluarAwal, total: (hSisaAwal + dLunasAwal) - pKeluarAwal },
      piutang: { debet: pKeluarAwal, kredit: dLunasAwal + kerugianAwal, total: pKeluarAwal - (dLunasAwal + kerugianAwal) },
      hibah: { debet: 0, kredit: hSisaAwal, total: hSisaAwal },
      beban: { debet: kerugianAwal, kredit: 0, total: kerugianAwal },
      hutang: { debet: 0, kredit: hutangAwal, total: hutangAwal },
      aktiva_tetap: { debet: aktivaAwal, kredit: 0, total: aktivaAwal }
    };

    const jurnal_mutasi = {
      kas: { debet: hSisaMutasi + dLunasMutasi, kredit: pKeluarMutasi, total: (hSisaMutasi + dLunasMutasi) - pKeluarMutasi },
      piutang: { debet: pKeluarMutasi, kredit: dLunasMutasi + kerugianMutasi, total: pKeluarMutasi - (dLunasMutasi + kerugianMutasi) },
      hibah: { debet: 0, kredit: hSisaMutasi, total: hSisaMutasi },
      beban: { debet: kerugianMutasi, kredit: 0, total: kerugianMutasi },
      hutang: { debet: 0, kredit: hutangMutasi, total: hutangMutasi },
      aktiva_tetap: { debet: aktivaMutasi, kredit: 0, total: aktivaMutasi }
    };

    const jurnal_saldo_akhir = {
      kas: { 
        debet: jurnal_saldo_awal.kas.debet + jurnal_mutasi.kas.debet, 
        kredit: jurnal_saldo_awal.kas.kredit + jurnal_mutasi.kas.kredit, 
        total: jurnal_saldo_awal.kas.total + jurnal_mutasi.kas.total 
      },
      piutang: { 
        debet: jurnal_saldo_awal.piutang.debet + jurnal_mutasi.piutang.debet, 
        kredit: jurnal_saldo_awal.piutang.kredit + jurnal_mutasi.piutang.kredit, 
        total: jurnal_saldo_awal.piutang.total + jurnal_mutasi.piutang.total 
      },
      hibah: { 
        debet: jurnal_saldo_awal.hibah.debet + jurnal_mutasi.hibah.debet, 
        kredit: jurnal_saldo_awal.hibah.kredit + jurnal_mutasi.hibah.kredit, 
        total: jurnal_saldo_awal.hibah.total + jurnal_mutasi.hibah.total 
      },
      beban: { 
        debet: jurnal_saldo_awal.beban.debet + jurnal_mutasi.beban.debet, 
        kredit: jurnal_saldo_awal.beban.kredit + jurnal_mutasi.beban.kredit, 
        total: jurnal_saldo_awal.beban.total + jurnal_mutasi.beban.total 
      },
      hutang: { 
        debet: jurnal_saldo_awal.hutang.debet + jurnal_mutasi.hutang.debet, 
        kredit: jurnal_saldo_awal.hutang.kredit + jurnal_mutasi.hutang.kredit, 
        total: jurnal_saldo_awal.hutang.total + jurnal_mutasi.hutang.total 
      },
      aktiva_tetap: { 
        debet: jurnal_saldo_awal.aktiva_tetap.debet + jurnal_mutasi.aktiva_tetap.debet, 
        kredit: jurnal_saldo_awal.aktiva_tetap.kredit + jurnal_mutasi.aktiva_tetap.kredit, 
        total: jurnal_saldo_awal.aktiva_tetap.total + jurnal_mutasi.aktiva_tetap.total 
      }
    };

    // Modal Logs
    const modalQuery = `SELECT * FROM pinjaman_modal_transactions ORDER BY tanggal ASC, id ASC`;
    const modalResults = await db.sequelize.query(modalQuery, { type: db.Sequelize.QueryTypes.SELECT });
    let runningBalance = 0;
    const modalLogs = modalResults.map(row => {
      const amount = parseFloat(row.jumlah);
      const signedAmount = row.jenis === 'DEBET' ? -amount : amount; 
      runningBalance += signedAmount;
      return {
        id: row.id,
        tanggal: row.tanggal,
        no_transaksi: row.no_transaksi,
        keperluan: row.keperluan,
        jenis: row.jenis,
        jumlah: amount,
        pic: row.pic,
        saldo: runningBalance
      };
    });

    const hutangQuery = `SELECT * FROM pinjaman_hutang_transactions ORDER BY tanggal ASC, id ASC`;
    const hutangResults = await db.sequelize.query(hutangQuery, { type: db.Sequelize.QueryTypes.SELECT });
    let hutangBalance = 0;
    const hutangLogs = hutangResults.map(row => {
      const amount = parseFloat(row.jumlah);
      const signedAmount = row.jenis === 'DEBET' ? -amount : amount; 
      hutangBalance += signedAmount;
      return {
        id: row.id,
        date: row.tanggal,
        tanggal: row.tanggal,
        no_transaksi: row.no_transaksi,
        keperluan: row.keperluan,
        jenis: row.jenis,
        jumlah: amount,
        pic: row.pic,
        saldo: hutangBalance
      };
    });

    const aktivaQuery = `SELECT * FROM pinjaman_aktiva_tetap_transactions ORDER BY tanggal ASC, id ASC`;
    const aktivaResults = await db.sequelize.query(aktivaQuery, { type: db.Sequelize.QueryTypes.SELECT });
    let aktivaBalance = 0;
    const aktivaLogs = aktivaResults.map(row => {
      const amount = parseFloat(row.jumlah);
      const signedAmount = row.jenis === 'DEBET' ? amount : -amount; 
      aktivaBalance += signedAmount;
      return {
        id: row.id,
        date: row.tanggal,
        tanggal: row.tanggal,
        no_transaksi: row.no_transaksi,
        keperluan: row.keperluan,
        jenis: row.jenis,
        jumlah: amount,
        pic: row.pic,
        saldo: aktivaBalance
      };
    });

    return res.status(200).json({
      status: true,
      data: {
        total_pinjaman_keluar: pKeluarAwal + pKeluarMutasi,
        total_dibayar: dLunasAwal + dLunasMutasi,
        sisa_piutang: jurnal_saldo_akhir.piutang.total,
        jurnal: {
          saldo_awal: jurnal_saldo_awal,
          mutasi: jurnal_mutasi,
          saldo_akhir: jurnal_saldo_akhir
        },
        listData,
        listTotals,
        modalData: modalLogs,
        hutangData: hutangLogs,
        aktivaTetapData: aktivaLogs
      }
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getPinjamanReport;
