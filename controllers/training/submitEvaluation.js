import db from "../../models/index.js";

const submitEvaluation = async (req, res) => {
  try {
    const memberId = req.userId;
    const { material_id, answers } = req.body;

    if (!material_id || !answers) {
      return res.status(400).json({
        status: false,
        message: "Material ID dan jawaban harus diisi"
      });
    }

    const material = await db.Material.findOne({
      where: { material_id: material_id }
    });

    if (!material) {
      return res.status(404).json({
        status: false,
        message: "Materi tidak ditemukan"
      });
    }

    // Calculate score (simplified logic - in real implementation, compare with correct answers)
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.is_correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;

    // Save evaluation
    const evaluation = await db.Evaluation.create({
      member_id: memberId,
      material_id: material_id,
      score: score,
      passed: passed,
      answers: answers
    });

    // If passed, unlock next material
    if (passed) {
      const nextMaterial = await db.Material.findOne({
        where: {
          curriculum_id: material.curriculum_id,
          order_index: material.order_index + 1
        }
      });

      if (nextMaterial) {
        await nextMaterial.update({ is_unlocked: true });
      }

      // Update ranking
      const [ranking] = await db.Ranking.findOrCreate({
        where: { member_id: memberId },
        defaults: {
          member_id: memberId,
          total_score: score,
          completed_materials: 1
        }
      });

      if (!ranking.isNewRecord) {
        await ranking.update({
          total_score: ranking.total_score + score,
          completed_materials: ranking.completed_materials + 1
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: "Evaluasi berhasil disubmit",
      data: {
        evaluation_id: evaluation.evaluation_id,
        score: score,
        passed: passed
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { submitEvaluation };
