import db from "../../models/index.js";

const getRankings = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const rankings = await db.Ranking.findAll({
      include: [
        {
          model: db.Member,
          attributes: ['member_id', 'full_name', 'member_no']
        }
      ],
      order: [
        ['total_score', 'DESC'],
        ['completed_materials', 'DESC']
      ],
      limit: parseInt(limit)
    });

    // Add rank position
    const rankedData = rankings.map((r, index) => ({
      ...r.toJSON(),
      rank_position: index + 1
    }));

    return res.status(200).json({
      status: true,
      message: "Daftar peringkat berhasil diambil",
      data: rankedData
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getMyRanking = async (req, res) => {
  try {
    const memberId = req.userId;

    const myRanking = await db.Ranking.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: db.Member,
          attributes: ['member_id', 'full_name', 'member_no']
        }
      ]
    });

    if (!myRanking) {
      return res.status(200).json({
        status: true,
        message: "Anda belum memiliki data peringkat",
        data: null
      });
    }

    // Calculate rank position
    const higherScores = await db.Ranking.count({
      where: {
        total_score: { [db.Sequelize.Op.gt]: myRanking.total_score }
      }
    });

    myRanking.dataValues.rank_position = higherScores + 1;

    return res.status(200).json({
      status: true,
      message: "Peringkat Anda berhasil diambil",
      data: myRanking
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { getRankings, getMyRanking };
