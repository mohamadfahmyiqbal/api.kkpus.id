import db from "../../../models/index.js";

const MemberRegistration = db.MemberRegistration;
const MembershipTermination = db.MembershipTermination;
const ApprovalStep = db.ApprovalStep;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

export const getPendingMemberApprovals = async (req, res) => {
  try {
    const userRoleIds = req.userRoleIds || [];
    
    if (userRoleIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const [pendingRegistrations, pendingTerminations] = await Promise.all([
      MemberRegistration.findAll({
        where: {
          final_status: 'PENDING'
        },
        include: [
          {
            model: ApprovalStep,
            as: 'currentStep',
            include: [{ model: db.UserRole, as: 'verifierRole' }],
            where: {
              role_id: {
                [Op.in]: userRoleIds
              }
            },
            required: true
          },
          {
            model: db.Member,
            as: 'member',
            include: [
              { model: db.MemberBankAccount, as: 'bankAccounts' },
              { model: db.MemberEmployment, as: 'employments' },
              { model: db.Account, as: 'account' },
              { model: db.MemberEmergencyContact, as: 'emergencyContacts' },
              { model: db.MemberStatus, as: 'status' },
              { 
                model: db.MemberRoleAssignment, 
                as: 'roleAssignments',
                include: [{ model: db.UserRole, as: 'role' }]
              }
            ]
          },
          {
            model: db.MemberStatus,
            as: 'memberTypeDetail'
          },
          {
            model: db.ApprovalFlow,
            as: 'flow',
            include: [
              {
                model: db.ApprovalStep,
                as: 'steps',
                include: [{ model: db.UserRole, as: 'verifierRole' }]
              }
            ]
          },
          {
            model: db.Approval,
            as: 'approvals',
            required: false
          }
        ],
        order: [['registered_at', 'ASC']]
      }),
      MembershipTermination.findAll({
        where: {
          status: 'PENDING'
        },
        include: [
          {
            model: ApprovalStep,
            as: 'currentStep',
            include: [{ model: db.UserRole, as: 'verifierRole' }],
            where: {
              role_id: {
                [Op.in]: userRoleIds
              }
            },
            required: true
          },
          {
            model: db.Member,
            as: 'member',
            include: [
              { model: db.MemberBankAccount, as: 'bankAccounts' },
              { model: db.MemberEmployment, as: 'employments' },
              { model: db.Account, as: 'account' },
              { model: db.MemberEmergencyContact, as: 'emergencyContacts' },
              { model: db.MemberStatus, as: 'status' },
              { model: db.MemberFinancialSummary, as: 'financial_summary' },
              { 
                model: db.MemberRoleAssignment, 
                as: 'roleAssignments',
                include: [{ model: db.UserRole, as: 'role' }]
              }
            ]
          },
          {
            model: db.ApprovalFlow,
            as: 'flow',
            include: [
              {
                model: db.ApprovalStep,
                as: 'steps',
                include: [{ model: db.UserRole, as: 'verifierRole' }]
              }
            ]
          },
          {
            model: db.Approval,
            as: 'approvals',
            required: false
          }
        ],
        order: [['submitted_at', 'ASC']]
      })
    ]);

    const mergedData = [
      ...pendingRegistrations.map(r => ({
        ...r.toJSON(),
        type: 'REGISTRATION'
      })),
      ...pendingTerminations.map(t => ({
        ...t.toJSON(),
        type: 'TERMINATION'
      }))
    ];

    // Sort combined array by date
    mergedData.sort((a, b) => {
      const dateA = new Date(a.registered_at || a.submitted_at);
      const dateB = new Date(b.registered_at || b.submitted_at);
      return dateA - dateB;
    });

    return res.status(200).json({
      success: true,
      message: "Data approval keanggotaan berhasil diambil",
      data: mergedData
    });

  } catch (error) {
    console.error("Error getPendingMemberApprovals:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data approval"
    });
  }
};
