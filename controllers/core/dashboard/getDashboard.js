import db from "../../../models/index.js";

const getDashboard = async (req, res) => {
  try {
    const memberId = req.userId;

    // Get member data with status
    const member = await db.Member.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: db.MemberStatus,
          as: "status",
        },
      ],
    });

    if (!member) {
      return res.status(404).json({
        status: false,
        message: "Member tidak ditemukan",
      });
    }

    const memberType = member.member_type; // 'REGULER', 'LUAR_BIASA', or null (Belum Terdaftar)
    const statusName = member.status ? member.status.status_name : "UNKNOWN";

    // Dashboard data based on membership type
    let dashboardData = {
      member_id: member.member_id,
      member_no: member.member_no,
      full_name: member.full_name,
      member_type: memberType,
      status: statusName,
      email: member.email,
      phone_number: member.phone_number,
    };

    if (!memberType || memberType === "PENDING") {
      // Dashboard Awal - Belum Terdaftar
      dashboardData.dashboard_type = "AWAL";
      dashboardData.features = {
        evaluation: true,
        articles: true,
        pinjaman_lunak: true,
        registration_banner: true,
      };

      // Check if has pending registration
      const pendingRegistration = await db.MemberRegistration.findOne({
        where: {
          member_id: member.member_id,
          final_status: "PENDING",
        },
      });

      dashboardData.has_pending_registration = !!pendingRegistration;
    } else if (memberType === "REGULER") {
      // Dashboard Reguler
      dashboardData.dashboard_type = "REGULER";

      // Get total saldo
      const savingsSummary = await db.Savings.findAll({
        where: {
          member_id: memberId,
          status: "COMPLETED",
        },
        attributes: [
          [db.sequelize.fn("SUM", db.sequelize.col("amount")), "total_savings"],
        ],
      });

      const totalSaldo = savingsSummary[0]?.dataValues?.total_savings || 0;

      // Get pending bills count
      const pendingBills = await db.Bill.count({
        where: {
          member_id: memberId,
          status: "PENDING",
        },
      });

      dashboardData.features = {
        simpanan: true,
        transaksi: true,
        program: true,
        tabungan: true,
        investasi: true,
        training: true,
      };

      dashboardData.financial = {
        total_saldo: totalSaldo,
        pending_bills_count: pendingBills,
      };
    } else if (memberType === "LUAR_BIASA") {
      // Dashboard Luar Biasa
      dashboardData.dashboard_type = "LUAR_BIASA";

      // Get pending bills count
      const pendingBills = await db.Bill.count({
        where: {
          member_id: memberId,
          status: "PENDING",
        },
      });

      dashboardData.features = {
        transaksi: true,
        tabungan: true,
        training: true,
      };

      dashboardData.financial = {
        pending_bills_count: pendingBills,
      };
    }

    return res.status(200).json({
      status: true,
      message: "Dashboard data berhasil diambil",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem.",
    });
  }
};

export { getDashboard };
