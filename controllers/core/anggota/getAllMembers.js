import db from "../../../models/index.js";
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
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { member_no: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (type) {
      whereClause.member_type = type;
    }

    const { count, rows } = await Member.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: db.MemberStatus,
        as: 'status',
        attributes: ['status_name']
      }],
      limit,
      offset,
      order: [['join_date', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: "Data anggota berhasil diambil",
      data: {
        totalItems: count,
        members: rows,
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
