// 📁 controllers/financing/getFinancingDetail.js
import db from "../../models/index.js";

const getFinancingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await db.FinancingApplication.findOne({
      where: { financing_id: id },
      include: [
        {
          model: db.Member,
          as: 'member',
          attributes: ['full_name', 'member_no', 'member_type'] 
        },
        {
          model: db.ApprovalStep,
          as: 'currentStep',
          attributes: ['step_name']
        },
        {
          model: db.Approval,
          as: "approvals",
          where: { entity_ref: 'financing_applications' },
          required: false,
          include: [
            {
              model: db.ApprovalStep,
              as: "step",
              include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
            },
            {
              model: db.Member,
              as: "approver",
              attributes: ["full_name"]
            }
          ]
        }
      ]
    });

    if (!detail) {
      return res.status(404).json({ status: false, message: "Data tidak ditemukan" });
    }

    const existingApprovals = detail.approvals || [];

    // DEBUG: Log approval data
    console.log('[getFinancingDetail] Approvals found:', existingApprovals.length);
    existingApprovals.forEach((a, i) => {
      console.log(`[getFinancingDetail] Approval ${i}:`, {
        decision: a.decision,
        stepId: a.approval_step_id,
        roleName: a.step?.verifierRole?.role_name,
        stepName: a.step?.step_name
      });
    });

    // Cek transaksi terakhir untuk pembayaran pembiayaan (DP) yang berstatus PAID
    // Filter berdasarkan created_at >= detail.created_at agar tidak nyangkut ke pembiayaan lama
    const latestPaidTx = await db.Transaction.findOne({
      where: {
        member_id: detail.member_id,
        tx_category: 'FINANCING_PAYMENT',
        status: 'PAID',
        created_at: {
          [db.Sequelize.Op.gte]: detail.createdAt || detail.created_at
        }
      },
      order: [['created_at', 'DESC']]
    });

    // Cari langsung di tabel BillItem sebagai fallback jika Transaction gagal terupdate
    const paidDPItem = await db.BillItem.findOne({
      where: {
        financing_application_id: detail.financing_id,
        category_code: 'TRANSACTION_DOWN_PAYMENT',
        status: 'PAID',
        created_at: {
          [db.Sequelize.Op.gte]: detail.createdAt || detail.created_at
        }
      },
      order: [['created_at', 'DESC']]
    });

    const unpaidItems = await db.BillItem.findAll({
      where: {
        financing_application_id: detail.financing_id,
        category_code: 'TRANSACTION_INSTALLMENT',
        status: 'UNPAID'
      }
    });
    const unpaid_amount_raw = unpaidItems.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const unpaid_term_count_raw = unpaidItems.length;

    const paidInstallmentItems = await db.BillItem.findAll({
      where: {
        financing_application_id: detail.financing_id,
        category_code: 'TRANSACTION_INSTALLMENT',
        status: 'PAID'
      }
    });

    const paid_installment_amount = paidInstallmentItems.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const paid_term_count = paidInstallmentItems.length;

    const allInstallmentsRaw = [...paidInstallmentItems, ...unpaidItems];
    allInstallmentsRaw.sort((a, b) => new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0));

    const installments = allInstallmentsRaw.map((item, idx) => ({
      id: item.bill_item_id || item.id,
      installment_number: item.term_sequence || (idx + 1),
      payment_date: item.status === 'PAID' ? (item.updated_at || item.updatedAt) : null,
      description: item.item_name || item.description || `Setoran ${idx + 1}`,
      amount: item.amount,
      status: item.status
    }));

    const expectedTotalInstallment = (parseFloat(detail.item_price || detail.amount_requested || 0) - parseFloat(detail.down_payment || 0));
    
    let unpaid_amount = unpaid_amount_raw;
    let unpaid_term_count = unpaid_term_count_raw;

    if (paid_installment_amount >= expectedTotalInstallment && expectedTotalInstallment > 0) {
      unpaid_amount = 0;
      unpaid_term_count = 0;
    }

    const isDPPaid = !!latestPaidTx || !!paidDPItem;
    const eligibleForPaidStatus = ["WAITING_PAYMENT", "READY_TO_PAY", "PAID", "APPROVED"].includes(detail.status);
    
    let finalStatus = detail.status;
    if (unpaid_term_count === 0 && paid_term_count > 0) {
      finalStatus = 'PAID';
    } else if (isDPPaid && eligibleForPaidStatus) {
      if (!detail.cooperation_months || detail.cooperation_months === 0 || detail.cooperation_months === "0") {
        finalStatus = 'PAID';
      } else if (finalStatus === "WAITING_PAYMENT" || finalStatus === "READY_TO_PAY") {
        finalStatus = 'APPROVED';
      }
    }

    return res.json({
      status: true,
      data: {
        financing_id: detail.financing_id,
        // Gunakan status dari transaksi/billItem jika ada dan sudah PAID dan memang valid untuk jadi PAID
        status: finalStatus,
        payment_type: latestPaidTx?.payment_type || 'midtrans',
        settlement_time: latestPaidTx?.settlement_time || paidDPItem?.updated_at,
        // Field Utama
        purpose: detail.purpose,
        category: detail.category,
        arisan_batch_id: detail.arisan_batch_id,
        item_price: detail.item_price,         
        down_payment: detail.down_payment,     
        amount_requested: detail.amount_requested, 
        operational_cost: detail.operational_cost,
        total_tagihan: detail.total_tagihan,
        discount: detail.discount,
        margin_percent: detail.margin_percent,
        margin_amount: detail.margin_amount,
        
        // Field Cicilan & Status
        cooperation_months: detail.cooperation_months,
        monthly_installment: detail.monthly_installment,
        akad_type: detail.akad_type,
        unpaid_amount: unpaid_amount,
        unpaid_term_count: unpaid_term_count,
        paid_term_count: paid_term_count,
        paid_installment_amount: paid_installment_amount,
        
        // Metode Pencairan
        metode_pencairan: detail.metode_pencairan,
        nama_nasabah: detail.nama_nasabah,
        nama_peserta_2: detail.nama_peserta_2,
        keterangan: detail.keterangan,
        installments: installments,
        // Field untuk Non Tunai
        no_rekening: detail.no_rekening,
        bank_tujuan: detail.bank_tujuan,
        // Field untuk Tunai
        lokasi_pencairan: detail.lokasi_pencairan,
        tanggal_pencairan: detail.tanggal_pencairan,
        jam_pencairan: detail.jam_pencairan,
        file_evidence: detail.file_evidence,
        transfer_proof_path: detail.transfer_proof_path,
        
        // Field Pendanaan Syariah UMKM
        business_name: detail.business_name,
        business_sector: detail.business_sector,
        business_address: detail.business_address,
        estimated_yearly_turnover: detail.estimated_yearly_turnover,
        estimated_monthly_turnover: detail.estimated_monthly_turnover,
        investor_profit_share: detail.investor_profit_share,
        contract_proof: detail.contract_proof,
        additional_documents: detail.additional_documents,
        
        // Status Approval
        is_approved_pengawas: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'PENGAWAS' && a.decision === 'APPROVED'
        ),
        is_approved_ketua: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'KETUA' && a.decision === 'APPROVED'
        ),
        is_approved_bendahara: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'BENDAHARA' && a.decision === 'APPROVED'
        ),
        is_rejected: existingApprovals.some(a => a.decision === 'REJECTED'),
        
        // Dynamic approval chain dari data approvals
        approvalChain: existingApprovals.map(a => ({
          role: a.step?.verifierRole?.role_name,
          stepName: a.step?.step_name,
          decision: a.decision,
          approvedAt: a.created_at,
          approverName: a.approver?.full_name,
          note: a.note
        })),
        
        // Timestamps & Relasi
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
        member: detail.member,
        currentStep: detail.currentStep
      }
    });
  } catch (error) {
    console.error("Detail Error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingDetail;