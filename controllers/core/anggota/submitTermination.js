import db from "../../../models/index.js";

const submitTermination = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;
    const { reason, supporting_document_path } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: false,
        message: "Alasan berhenti keanggotaan harus diisi"
      });
    }

    // Check if member has pending termination
    const existingTermination = await db.MembershipTermination.findOne({
      where: {
        member_id: memberId,
        status: { [db.Sequelize.Op.in]: ['PENDING', 'APPROVED'] }
      },
      transaction: t
    });

    if (existingTermination) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Anda sudah memiliki pengajuan berhenti keanggotaan yang sedang diproses"
      });
    }

    // Check approval flow for membership termination
    const flow = await db.ApprovalFlow.findOne({
      where: { entity_ref: 'membership_terminations' },
      transaction: t
    });

    let terminationData = {
      member_id: memberId,
      reason: reason,
      status: 'PENDING'
    };

    if (supporting_document_path) {
      terminationData.supporting_document_path = supporting_document_path;
    }

    if (flow) {
      const firstStep = await db.ApprovalStep.findOne({
        where: { approval_flow_id: flow.approval_flow_id },
        order: [['step_order', 'ASC']],
        transaction: t
      });

      if (!firstStep) {
        await t.rollback();
        return res.status(500).json({
          status: false,
          message: "Approval Step belum dikonfigurasi."
        });
      }

      terminationData.approval_flow_id = flow.approval_flow_id;
      terminationData.current_step_id = firstStep.approval_step_id;
    }

    const termination = await db.MembershipTermination.create(terminationData, { transaction: t });

    await t.commit();

    return res.status(201).json({
      status: true,
      message: "Pengajuan berhenti keanggotaan berhasil disubmit",
      data: {
        termination_id: termination.termination_id,
        status: termination.status
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

const getTerminationStatus = async (req, res) => {
  try {
    const memberId = req.userId;

    const termination = await db.MembershipTermination.findOne({
      where: { member_id: memberId },
      order: [['submitted_at', 'DESC']]
    });

    if (!termination) {
      return res.status(200).json({
        status: true,
        message: "Tidak ada pengajuan berhenti keanggotaan",
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Status pengajuan berhenti keanggotaan berhasil diambil",
      data: termination
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { submitTermination, getTerminationStatus };
