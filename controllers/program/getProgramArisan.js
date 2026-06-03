// controllers/program/getProgramArisan.js

import db from "../../models/index.js";

const { ArisanParticipant, ArisanBatch, ArisanProgram, Member, FinancingApplication } = db;

const getProgramArisan = async (req, res) => {
  try {
    const memberId = req.userId;

    // 1. Cek financing_applications dulu (pengajuan arisan pending/approved tapi belum masuk participant)
    const financingApp = await FinancingApplication.findOne({
      where: { 
        member_id: memberId,
        category: 'Arisan',
        status: ['PENDING', 'IN_PROGRESS', 'WAITING_APPROVAL', 'APPROVED']
      },
      include: [
        {
          model: Member,
          as: 'member'
        },
        {
          model: ArisanBatch,
          as: 'arisanBatch',
          include: [{ model: ArisanProgram, as: 'program' }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (financingApp) {
      const isApproved = financingApp.status === 'APPROVED';
      const data = {
        participant_id: null,
        financing_id: financingApp.financing_id,
        member_name: financingApp.member?.name,
        program_name: financingApp.arisanBatch?.program?.program_name || financingApp.purpose || 'Program Arisan',
        batch_name: financingApp.arisanBatch?.batch_name || '',
        participant_no: '-',
        target_amount: financingApp.arisanBatch?.program?.target_amount || financingApp.amount_requested,
        monthly_contribution: financingApp.monthly_installment,
        current_balance: 0,
        created_at: financingApp.created_at,
        status: financingApp.status,
        is_pending: !isApproved,
        is_approved: isApproved,
        status_label: isApproved ? "Aktif (Disetujui)" : "Menunggu Approval"
      };
      return res.json({ success: true, data });
    }

    // 2. Ambil partisipasi arisan aktif milik member (yang sudah fix jadi peserta)
    const participation = await ArisanParticipant.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: ArisanBatch,
          as: 'batch',
          include: [
            {
              model: ArisanProgram,
              as: 'program'
            }
          ]
        },
        {
          model: Member,
          as: 'member'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!participation) {
      return res.json({ success: true, data: null });
    }

    // Mapping data ke format yang diharapkan frontend
    const data = {
      participant_id: participation.arisan_participant_id,
      member_name: participation.member?.name,
      program_name: participation.batch?.program?.program_name || 'Program Arisan',
      batch_name: participation.batch?.batch_name,
      participant_no: participation.participant_no,
      target_amount: participation.batch?.program?.target_amount,
      monthly_contribution: participation.batch?.monthly_installment,
      current_balance: participation.saldo_putang, // Menggunakan saldo_putang sebagai representasi "saldo" saat ini
      created_at: participation.created_at,
      status: participation.batch?.status,
      is_approved: true,
      status_label: "Aktif"
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in getProgramArisan:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getProgramArisan;
