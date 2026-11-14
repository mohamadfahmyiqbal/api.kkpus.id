import db from "../../../models/index.js";
import { maskMemberData } from "../../../utils/dataMasking.js";
const Member = db.Member;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

export const getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const type = req.query.type || "";
    
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (search) {
      const safeSearch = `%${search}%`;
      whereClause[Op.or] = [
        { full_name: { [Op.like]: safeSearch } },
        { member_no: { [Op.like]: safeSearch } },
        { nik_ktp: { [Op.like]: safeSearch } },
        { email: { [Op.like]: safeSearch } },
        { phone_number: { [Op.like]: safeSearch } }
      ];
    }
    
    if (type) {
      whereClause.member_type = type;
    }

    const { count, rows } = await Member.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      distinct: true,
      include: [
        {
          model: db.MemberStatus,
          as: 'status',
          attributes: ['status_name']
        },
        {
          model: db.MemberRoleAssignment,
          as: 'roleAssignments',
          include: [{
            model: db.UserRole,
            as: 'role',
            attributes: ['role_name']
          }]
        },
        {
          model: db.MemberBankAccount,
          as: 'bankAccounts',
          required: false
        },
        {
          model: db.MemberEmployment,
          as: 'employments',
          required: false
        },
        {
          model: db.MemberEmergencyContact,
          as: 'emergencyContacts',
          required: false
        },
        {
          model: db.BusinessProfile,
          as: 'business',
          required: false
        },
        {
          model: db.MemberFinancialSummary,
          as: 'financial_summary',
          required: false
        },
        {
          model: db.MemberRegistration,
          as: 'registration',
          required: false
        }
      ],
      limit,
      offset,
      order: [['join_date', 'DESC']]
    });

    // Apply HIPAA-compliant data masking for sensitive fields (email unmasked for admin view)
    const maskedMembers = rows.map(member => {
      const maskedMember = maskMemberData(member, true);

      // Restore full email for admin operational view
      if (member.email) {
        maskedMember.email = member.email;
      }

      // Mask additional sensitive fields not covered by maskMemberData
      if (member.nik_ktp) {
        maskedMember.nik_ktp = maskMemberData({ nik_ktp: member.nik_ktp }).nik_ktp;
      }

      return maskedMember;
    });

    return res.status(200).json({
      success: true,
      message: "Data anggota berhasil diambil",
      data: {
        totalItems: count,
        members: maskedMembers,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });

  } catch (error) {
    console.error("Get All Members Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data anggota"
    });
  }
};
