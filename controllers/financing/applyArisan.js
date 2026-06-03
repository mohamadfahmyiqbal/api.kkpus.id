// controllers/financing/applyArisan.js

import db from "../../models/index.js";
import { sendGlobalNotification } from "../utility/notificationHelper.js";

const { ArisanBatch, ArisanProgram, ArisanParticipant, FinancingApplication, ApprovalFlow, ApprovalStep } = db;

const applyArisan = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const memberId = req.userId;
    const { arisan_id, nama_anggota, nama_peserta_2, keterangan, item_name } = req.body;

    if (!arisan_id) {
      throw new Error("ID Arisan wajib diisi");
    }

    // 1. Check if the batch exists
    const batch = await ArisanBatch.findByPk(arisan_id, {
      include: [{ model: ArisanProgram, as: 'program' }],
      transaction: t
    });

    if (!batch) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Grup arisan tidak ditemukan" });
    }

    // 2. Check if member already has a pending application for this batch
    //    Use only existing columns in financing_applications table
    const existing = await FinancingApplication.findOne({
      where: { 
        member_id: memberId, 
        arisan_batch_id: arisan_id,
        status: ['PENDING', 'APPROVED']
      },
      transaction: t
    });

    if (existing) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Anda sudah memiliki pengajuan yang sedang diproses untuk grup arisan ini."
      });
    }

    // 3. Check participant quota using ArisanParticipant (existing table)
    const participantCount = await ArisanParticipant.count({
      where: { arisan_batch_id: arisan_id },
      transaction: t
    });

    if (participantCount >= (batch.participants_quota || 0)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Kuota grup arisan ini sudah penuh."
      });
    }

    // 4. Fetch Approval Flow for financing_applications (optional)
    let flow, firstStep;
    try {
      flow = await ApprovalFlow.findOne({ 
        where: { entity_ref: 'financing_applications' },
        transaction: t 
      });

      if (flow) {
        firstStep = await ApprovalStep.findOne({
          where: { approval_flow_id: flow.approval_flow_id },
          order: [['step_order', 'ASC']],
          transaction: t
        });
      }
    } catch (err) {
      console.warn("Approval config not found:", err.message);
    }

    // 5. Create Financing Application record (only columns that exist in DB)
    const applicationData = {
      member_id: memberId,
      arisan_batch_id: arisan_id,
      category: 'Arisan',
      purpose: item_name || `${batch.program?.program_name || 'Arisan'} - ${batch.batch_name || ''}`,
      item_price: batch.program?.target_amount || 0,
      amount_requested: batch.program?.target_amount || 0,
      monthly_installment: batch.program?.monthly_contribution || batch.monthly_installment || 0,
      cooperation_months: batch.program?.term_months || 0,
      status: 'PENDING',
      akad_type: 'Musyarakah Mutanaqisah',
      nama_nasabah: nama_anggota || '',
      nama_peserta_2: nama_peserta_2 || '',
      keterangan: keterangan || ''
    };

    // Only add approval fields if they exist
    if (flow) applicationData.approval_flow_id = flow.approval_flow_id;
    if (firstStep) applicationData.current_step_id = firstStep.approval_step_id;

    const application = await FinancingApplication.create(applicationData, { transaction: t });

    await t.commit();

    // 6. Send global notification
    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: memberId,
          title: "Pengajuan Arisan",
          content: `Pengajuan bergabung grup arisan ${batch.program?.program_name || 'Arisan'} (${batch.batch_name}) berhasil dikirim dan sedang menunggu persetujuan.`,
          type: "FINANCING",
          url: "/transaksi"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    res.status(201).json({
      success: true,
      message: "Pengajuan arisan berhasil dikirim dan menunggu persetujuan.",
      data: {
        financing_id: application.financing_id,
        arisan_id: arisan_id
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("applyArisan Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

export default applyArisan;