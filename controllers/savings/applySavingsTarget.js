import db from "../../models/index.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import moment from "moment";

export const applySavingsTarget = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;
    const { productType, nominalTarget, tenor, setoranAwal } = req.body;

    if (!productType || !nominalTarget || !tenor || !setoranAwal) {
      throw new Error("Semua field harus diisi (productType, nominalTarget, tenor, setoranAwal)");
    }

    // Capitalize product type for naming
    const productName = productType.charAt(0).toUpperCase() + productType.slice(1);
    const targetName = `Tabungan ${productName}`;

    // Calculate min monthly deposit
    const minMonthlyDeposit = Math.ceil((nominalTarget - setoranAwal) / tenor);

    // Create the Saving Target catalog entry (since it's custom per member request)
    const newTarget = await db.SavingTarget.create({
      target_name: targetName,
      category: productType,
      target_amount: nominalTarget,
      term_months: tenor,
      min_monthly_deposit: minMonthlyDeposit,
      akad_type: 'WADIAH' // default akad
    }, { transaction: t });

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
      status: 'PENDING'
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
          content: `Pengajuan ${targetName} senilai Rp ${Number(nominalTarget).toLocaleString('id-ID')} telah diproses.`,
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
        target_amount: newTarget.target_amount,
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
