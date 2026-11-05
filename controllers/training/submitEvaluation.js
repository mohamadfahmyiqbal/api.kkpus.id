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

    // Calculate score based on actual correct answers from quiz_questions in DB
    const questions = Array.isArray(material.quiz_questions) ? material.quiz_questions : [];
    const totalQuestions = questions.length > 0 ? questions.length : (answers.length || 1);

    let correctCount = 0;
    const validatedAnswers = [];

    if (questions.length > 0) {
      questions.forEach((q, idx) => {
        const studentAns = answers.find(a => a.question_id === q.id || a.question_index === idx);
        const actualCorrect = (q.correct_answer || q.correctAnswer || "").trim().toUpperCase();
        const selected = (studentAns?.selected_option || "").trim().toUpperCase();
        const isCorrect = selected !== "" && selected === actualCorrect;

        if (isCorrect) correctCount++;

        validatedAnswers.push({
          question_id: q.id || idx + 1,
          selected_option: selected,
          is_correct: isCorrect
        });
      });
    } else {
      // Fallback if no questions configured in material
      correctCount = answers.filter(a => a.is_correct).length;
      validatedAnswers.push(...answers);
    }

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    // Check if member has previously passed this material
    const previousPassed = await db.Evaluation.findOne({
      where: {
        member_id: memberId,
        material_id: material_id,
        passed: true
      }
    });

    // Save evaluation record
    const evaluation = await db.Evaluation.create({
      member_id: memberId,
      material_id: material_id,
      score: score,
      passed: passed,
      answers: validatedAnswers
    });

    // If passed and never passed before, update ranking without score inflation
    if (passed && !previousPassed) {
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
