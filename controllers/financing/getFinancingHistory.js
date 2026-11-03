import db from "../../models/index.js";
import { isBackoffice } from "../../utils/authorization.js";

const getFinancingHistory = async (req, res) => {
  try {
    // Sekarang req.user sudah terisi oleh middleware
    const member_id = req?.userId;

    if (!member_id) {
      return res.status(401).json({
        status: false,
        message: "Sesi tidak valid, member_id tidak ditemukan dalam request"
      });
    }

    const { type, all, batch_id } = req.query; // 'jualbeli' or 'pinjaman'
    const requestAllMembers = String(all) === "true";

    // all=true hanya untuk backoffice. Tanpa cek ini, anggota biasa dapat
    // membaca seluruh pembiayaan anggota lain.
    if (requestAllMembers && !(await isBackoffice(member_id))) {
      return res.status(403).json({
        status: false,
        message: "Akses ditolak. Fitur ini hanya untuk petugas backoffice.",
      });
    }

    const whereClause = {};
    if (!requestAllMembers) {
      whereClause.member_id = member_id;
    }

    if (type === 'pinjaman') {
      whereClause.purpose = { [db.Sequelize.Op.like]: 'Pinjaman%' };
    } else if (type === 'arisan') {
      whereClause.purpose = { [db.Sequelize.Op.like]: 'Arisan%' };
    } else if (type === 'pendanaan') {
      whereClause.category = 'Pendanaan Syariah UMKM';
    } else if (type === 'jualbeli') {
      whereClause.purpose = { 
        [db.Sequelize.Op.and]: [
          { [db.Sequelize.Op.notLike]: 'Pinjaman%' },
          { [db.Sequelize.Op.notLike]: 'Arisan%' }
        ]
      };
      whereClause.category = {
        [db.Sequelize.Op.and]: [
          { [db.Sequelize.Op.ne]: 'Pendanaan Syariah UMKM' }
        ]
      };
    }

    if (batch_id) {
      whereClause.arisan_batch_id = batch_id;
    }

    const history = await db.FinancingApplication.findAll({
      where: whereClause,
      include: [
        {
          model: db.Member,
          as: 'member',
          attributes: ['full_name', 'member_id']
        },
        {
          model: db.Approval,
          as: 'approvals',
          attributes: ['note', 'decision', 'created_at']
        },
        {
          model: db.ApprovalFlow,
          as: 'flow',
          include: [{
            model: db.ApprovalStep,
            as: 'steps',
            include: [{ model: db.UserRole, as: 'verifierRole' }]
          }]
        },
        {
          model: db.ApprovalStep,
          as: 'currentStep',
          include: [{ model: db.UserRole, as: 'verifierRole' }]
        }
      ],
      // Backoffice yang meminta all=true harus menerima seluruh data agar
      // ringkasan, pencarian, dan export tidak terpotong diam-diam.
      ...(requestAllMembers ? {} : { limit: 50 }),
      order: [['created_at', 'DESC']]
    });

    const memberIds = [...new Set(history.map(h => h.member_id))];

    const paidInstallments = await db.BillItem.findAll({
      where: {
        member_id: { [db.Sequelize.Op.in]: memberIds },
        category_code: {
          [db.Sequelize.Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN']
        },
        status: 'PAID'
      }
    });

    const paidByApp = {};
    paidInstallments.forEach(item => {
      const appId = item.financing_application_id;
      if (!appId) return; // Skip if no app id
      if (!paidByApp[appId]) {
        paidByApp[appId] = { total: 0, items: [], installment_amount: 0, installment_count: 0 };
      }
      paidByApp[appId].total += parseFloat(item.amount || 0);
      paidByApp[appId].items.push(item);
      if (item.category_code === 'TRANSACTION_INSTALLMENT') {
        paidByApp[appId].installment_amount += parseFloat(item.amount || 0);
        paidByApp[appId].installment_count += 1;
      }
    });

    const unpaidInstallments = await db.BillItem.findAll({
      where: {
        member_id: { [db.Sequelize.Op.in]: memberIds },
        category_code: 'TRANSACTION_INSTALLMENT',
        status: 'UNPAID'
      }
    });

    const unpaidByApp = {};
    unpaidInstallments.forEach(item => {
      const appId = item.financing_application_id;
      if (!appId) return;
      if (!unpaidByApp[appId]) {
        unpaidByApp[appId] = { total: 0, count: 0, items: [] };
      }
      unpaidByApp[appId].total += parseFloat(item.amount || 0);
      unpaidByApp[appId].count += 1;
      unpaidByApp[appId].items.push(item);
    });

    const result = history.map((h) => {
      const data = h.toJSON ? h.toJSON() : h;
      if (data.member) {
        data.member_name = data.member.full_name;
        if (!data.user_id) data.user_id = data.member.member_id;
      }
      if (!data.item_name && data.purpose) {
        data.item_name = data.purpose;
      }
      
      const appPayments = paidByApp[data.financing_id] || { total: 0, items: [], installment_amount: 0, installment_count: 0 };
      const appUnpaid = unpaidByApp[data.financing_id] || { total: 0, count: 0, items: [] };
      const allAppItems = (appPayments.items || []).concat(appUnpaid.items || []);
      const hasDPBill = allAppItems.some(item => ['TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'].includes(item.category_code));
      const hasPaidDP = appPayments.items.some(item => item.category_code === 'TRANSACTION_DOWN_PAYMENT' || item.category_code === 'DP_PEMBIAYAAN');
      
      // Total kewajiban cicilan yang harus dibayar anggota.
      // Prioritaskan total_tagihan (sudah memperhitungkan margin, biaya operasional,
      // DP, dan diskon). Jika belum tersedia, gunakan perhitungan fallback.
      const totalTagihan = parseFloat(data.total_tagihan || 0);
      const fallbackTotalTagihan = Math.max(
        0,
        parseFloat(data.item_price || data.amount_requested || 0) +
          parseFloat(data.operational_cost || 0) +
          parseFloat(data.margin_amount || 0) -
          parseFloat(data.down_payment || 0) -
          parseFloat(data.discount || 0)
      );
      const tenorTotal =
        parseFloat(data.monthly_installment || 0) *
        parseInt(data.cooperation_months || 0, 10);
      const expectedTotalInstallment =
        totalTagihan > 0
          ? totalTagihan
          : fallbackTotalTagihan > 0
            ? fallbackTotalTagihan
            : tenorTotal;

      // Kontrak hanya dianggap lunas jika nominal cicilan yang benar-benar sudah
      // dibayar menutup total kewajiban. Jangan mengandalkan "tidak ada BillItem
      // UNPAID" saja, karena data hasil import hanya membuat BillItem PAID.
      const isFullyPaid =
        expectedTotalInstallment > 0 &&
        appPayments.installment_amount >= expectedTotalInstallment;

      let calculatedUnpaid = appUnpaid.total;
      let calculatedUnpaidCount = appUnpaid.count;

      if (isFullyPaid) {
        calculatedUnpaid = 0;
        calculatedUnpaidCount = 0;
      }

      // Hanya tambahkan DP jika memang TIDAK ADA tagihan DP di sistem (legacy/offline fallback).
      // Jika tagihan DP ada di sistem (baik PAID atau UNPAID), gunakan appPayments.total yang sebenarnya.
      const legacyDPOffline = !hasDPBill && parseFloat(data.down_payment || 0) > 0;
      data.paid_amount = appPayments.total + (legacyDPOffline ? parseFloat(data.down_payment || 0) : 0);
      data.unpaid_amount = calculatedUnpaid;
      data.unpaid_term_count = calculatedUnpaidCount;
      data.paid_term_count = appPayments.installment_count;
      data.paid_installment_amount = appPayments.installment_amount;
      
      if (isFullyPaid && (data.status === 'APPROVED' || data.status === 'COMPLETED' || data.status === 'ACTIVE')) {
        data.status = 'PAID';
      }

      return data;
    });

    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingHistory;