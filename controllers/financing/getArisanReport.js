import db from "../../models/index.js";

const getArisanReport = async (req, res) => {
  try {
    const member_id = req?.userId;

    if (!member_id) {
      return res.status(401).json({
        status: false,
        message: "Sesi tidak valid, member_id tidak ditemukan dalam request"
      });
    }

    const { all } = req.query;
    const { ArisanParticipant, ArisanBatch, ArisanProgram, ArisanPayment, ArisanDraw, Member } = db;

    const currentYear = new Date().getFullYear();

    // Condition based on role/all
    const participantWhere = {};
    if (String(all) !== 'true') {
      participantWhere.member_id = member_id;
    }

    // 1. Fetch Participants with related Batch and Program
    const participants = await ArisanParticipant.findAll({
      where: participantWhere,
      include: [
        { model: Member, as: 'member' },
        { 
          model: ArisanBatch, 
          as: 'batch',
          include: [{ model: ArisanProgram, as: 'program' }]
        }
      ]
    });

    const participantIds = participants.map(p => p.arisan_participant_id);
    const memberIds = participants.map(p => p.member_id);
    const batchIds = [...new Set(participants.map(p => p.arisan_batch_id))];

    // 2. Fetch Payments from BillItem via FinancingApplication
    const financingApps = await db.FinancingApplication.findAll({
      where: {
        member_id: { [db.Sequelize.Op.in]: memberIds.length ? memberIds : [''] },
        arisan_batch_id: { [db.Sequelize.Op.in]: batchIds.length ? batchIds : [''] }
      }
    });
    const financingIds = financingApps.map(f => f.financing_id);

    const payments = await db.BillItem.findAll({
      where: {
        financing_application_id: { [db.Sequelize.Op.in]: financingIds.length ? financingIds : [''] },
        category_code: 'TRANSACTION_INSTALLMENT',
        status: 'PAID'
      }
    });

    // 3. Fetch Draws
    const draws = await ArisanDraw.findAll({
      where: {
        arisan_batch_id: { [db.Sequelize.Op.in]: batchIds.length ? batchIds : [''] }
      }
    });

    // 4. Construct listData (Tab Arisan)
    const listData = participants.map((p) => {
      // Find payments for this member and batch via FinancingApplication
      const fApp = financingApps.find(f => f.member_id === p.member_id && f.arisan_batch_id === p.arisan_batch_id);
      const pPayments = fApp 
        ? payments.filter(pm => pm.financing_application_id === fApp.financing_id)
        : [];

      let total_pembayaran = 0;
      let pembayaran_ini = 0;
      let pembayaran_lalu = 0;
      let pembayaran_lalu2 = 0;

      pPayments.forEach(pm => {
        const amt = parseFloat(pm.amount || 0);
        total_pembayaran += amt;
        const year = new Date(pm.updated_at || pm.updatedAt || pm.created_at).getFullYear();
        if (year === currentYear) pembayaran_ini += amt;
        else if (year === currentYear - 1) pembayaran_lalu += amt;
        else if (year === currentYear - 2) pembayaran_lalu2 += amt;
      });

      const term = p.batch?.program?.term_months || p.batch?.participants_quota || 0;
      const targetAmount = parseFloat(p.batch?.program?.target_amount || 0);
      const totalExpected = parseFloat(p.batch?.monthly_installment || p.batch?.program?.monthly_contribution || 0) * term;
      const sisa_cicilan = Math.max(0, totalExpected - total_pembayaran);

      return {
        id: p.arisan_participant_id,
        nama: p.member?.name || p.member?.full_name || '-',
        batch: p.batch?.batch_name || '-',
        jenis: p.batch?.program?.program_name || '-',
        term: `${pPayments.length}/${term}`,
        total_pembayaran,
        sisa_cicilan,
        status_cicilan: pPayments.length >= term ? 'COMPLETED' : 'ON PROGRESS',
        pembayaran_ini,
        pembayaran_lalu,
        pembayaran_lalu2
      };
    });

    // 5. Construct danaList (Tab Penggunaan Dana)
    const batches = [...new Set(participants.map(p => p.batch))].filter(Boolean);
    const danaList = batches.map(b => {
      const bDraws = draws.filter(d => d.arisan_batch_id === b.arisan_batch_id && d.status !== 'FAILED');
      
      let penggunaan_ini = 0;
      let penggunaan_lalu = 0;
      let penggunaan_lalu2 = 0;
      let total_penggunaan = 0;

      bDraws.forEach(d => {
        const amt = parseFloat(d.disbursement_amount || 0);
        total_penggunaan += amt;
        const year = new Date(d.draw_date || d.created_at).getFullYear();
        if (year === currentYear) penggunaan_ini += amt;
        else if (year === currentYear - 1) penggunaan_lalu += amt;
        else if (year === currentYear - 2) penggunaan_lalu2 += amt;
      });

      const total_komitmen = parseFloat(b.program?.target_amount || 0) * (b.participants_quota || 0);
      const sisa_komitmen = Math.max(0, total_komitmen - total_penggunaan);

      return {
        id: b.arisan_batch_id,
        batch: b.batch_name || '-',
        total_komitmen,
        sisa_komitmen,
        penggunaan_ini,
        penggunaan_lalu,
        penggunaan_lalu2
      };
    });

    // 6. Construct jurnal (Tab Jurnal)
    let totalSetoran = 0;
    let totalPenarikan = 0;

    payments.forEach(pm => {
      totalSetoran += parseFloat(pm.amount || 0);
    });

    draws.forEach(d => {
      if (d.status !== 'FAILED' && d.status !== 'CANCELLED') {
        totalPenarikan += parseFloat(d.disbursement_amount || 0);
      }
    });

    const jurnal = {
      totalSetoran,
      totalPenarikan,
      totalProgram: Math.max(0, totalSetoran - totalPenarikan)
    };

    res.status(200).json({
      status: true,
      data: {
        listData,
        danaList,
        jurnal
      }
    });
  } catch (error) {
    console.error("Error generating Arisan Report:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getArisanReport;
