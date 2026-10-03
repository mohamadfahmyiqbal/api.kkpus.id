import db from "../../models/index.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import moment from "moment";

export const applySavingsTarget = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;
    const { saving_target_id, monthly_deposit, term_months } = req.body;

    if (!saving_target_id || !monthly_deposit || !term_months) {
      throw new Error("Data pengajuan tidak lengkap");
    }

    // Find the Master Program
    const newTarget = await db.SavingTarget.findByPk(saving_target_id, { transaction: t });
    if (!newTarget) {
      throw new Error("Program tabungan tidak ditemukan");
    }

    const targetName = newTarget.target_name;
    const targetAmount = monthly_deposit * term_months;
    const setoranAwal = monthly_deposit; // Default setoran awal is the first month's deposit

    // Handle Approval Flow
    const flow = await db.ApprovalFlow.findOne({
      where: { flow_name: 'FLOW_TABUNGAN' },
      transaction: t
    });

    let initialStepId = null;
    let flowId = null;

    if (flow) {
      flowId = flow.approval_flow_id;
      const firstStep = await db.ApprovalStep.findOne({
        where: { approval_flow_id: flowId },
        order: [['step_order', 'ASC']],
        transaction: t
      });
      if (firstStep) initialStepId = firstStep.approval_step_id;
    }

    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    const newMemberTarget = await db.MemberSavingTarget.create({
      member_id: memberId,
      saving_target_id: newTarget.saving_target_id,
      start_period_month: currentMonth,
      start_period_year: currentYear,
      current_balance: 0,
      approval_flow_id: flowId,
      current_step_id: initialStepId,
      status: 'PENDING',
      target_amount: targetAmount,
      term_months: term_months,
      monthly_deposit: monthly_deposit
    }, { transaction: t });

    // Generate Setoran Awal bill
    if (setoranAwal > 0) {
      const [tabunganBillType] = await db.BillType.findOrCreate({
        where: { type_code: 'TABUNGAN_DEPOSIT' },
        defaults: {
          tx_type: 'SETORAN',
          category_map: 'SAVINGS_TARGET',
          type_name: 'Setoran Tabungan',
          period_type: 'MONTHLY',
          default_amount: 0
        },
        transaction: t
      });

      await db.BillItem.create({
        bill_type_id: tabunganBillType.bill_type_id,
        category_code: `TAB_DEP_${newMemberTarget.member_saving_target_id}`,
        bill_id: null,
        member_id: memberId,
        description: `Setoran Awal ${targetName}`,
        amount: setoranAwal,
        due_date: new Date(),
        status: 'UNPAID'
      }, { transaction: t });
    }

    if (initialStepId && flowId) {
        // Biarkan tabel Approval dan EntityStepApproval diisi nanti oleh processApproval.js
        // untuk menghindari error STEP_ALREADY_PROCESSED akibat is_approved: 0
    }

    await t.commit();

    // Send Notification
    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: memberId,
          title: "Pengajuan Tabungan Berhasil",
          content: `Pengajuan ${targetName} senilai Rp ${Number(targetAmount).toLocaleString('id-ID')} telah diproses.`,
          type: "SAVINGS",
          url: "/tabungan"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    return res.status(201).json({
      status: true,
      message: "Pengajuan tabungan berhasil diproses.",
      data: {
        saving_target_id: newTarget.saving_target_id,
        target_name: newTarget.target_name,
        target_amount: targetAmount,
        member_saving_target_id: newMemberTarget.member_saving_target_id
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
