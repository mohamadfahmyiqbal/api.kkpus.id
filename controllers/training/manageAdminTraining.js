import db from "../../models/index.js";
const { Curriculum, Material, Ranking } = db;

export const getAdminCurriculums = async (req, res) => {
  try {
    const curriculums = await Curriculum.findAll({ order: [["created_at", "DESC"]] });
    res.status(200).json({ status: true, data: curriculums });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createCurriculum = async (req, res) => {
  try {
    const { curriculum_name, curriculum_type, description, is_active } = req.body;
    const curriculum = await Curriculum.create({
      curriculum_name,
      curriculum_type,
      description,
      is_active,
    });
    res.status(201).json({ status: true, message: "Curriculum created", data: curriculum });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const { curriculum_name, curriculum_type, description, is_active } = req.body;
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) return res.status(404).json({ status: false, message: "Curriculum not found" });

    await curriculum.update({ curriculum_name, curriculum_type, description, is_active });
    res.status(200).json({ status: true, message: "Curriculum updated", data: curriculum });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) return res.status(404).json({ status: false, message: "Curriculum not found" });

    await curriculum.destroy();
    res.status(200).json({ status: true, message: "Curriculum deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAdminMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({ order: [["order_index", "ASC"]] });
    res.status(200).json({ status: true, data: materials });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { curriculum_id, material_title, material_name, material_type, description, content, content_url, media_url, order_index, sequence_no } = req.body;
    const material = await Material.create({
      curriculum_id,
      material_title: material_title || material_name,
      material_type,
      description: description || content,
      content_url: content_url || media_url,
      order_index: order_index !== undefined ? order_index : (sequence_no || 0)
    });
    res.status(201).json({ status: true, message: "Material created", data: material });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { curriculum_id, material_title, material_name, material_type, description, content, content_url, media_url, order_index, sequence_no } = req.body;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    await material.update({
      curriculum_id: curriculum_id || material.curriculum_id,
      material_title: material_title || material_name || material.material_title,
      material_type: material_type || material.material_type,
      description: description !== undefined ? description : (content !== undefined ? content : material.description),
      content_url: content_url !== undefined ? content_url : (media_url !== undefined ? media_url : material.content_url),
      order_index: order_index !== undefined ? order_index : (sequence_no !== undefined ? sequence_no : material.order_index)
    });
    res.status(200).json({ status: true, message: "Material updated", data: material });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    await material.destroy();
    res.status(200).json({ status: true, message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAdminEvaluations = async (req, res) => {
  try {
    const materials = await Material.findAll({
      attributes: ["material_id", "material_title", "quiz_questions"],
      order: [["created_at", "DESC"]]
    });

    const evaluations = [];
    materials.forEach((mat) => {
      if (Array.isArray(mat.quiz_questions)) {
        mat.quiz_questions.forEach((q, idx) => {
          evaluations.push({
            evaluation_id: `${mat.material_id}_${idx}`,
            material_id: mat.material_id,
            material_name: mat.material_title,
            question_index: idx,
            question: q.question,
            options: q.options || {},
            correct_answer: q.correct_answer || q.correctAnswer,
            points: q.points || 10
          });
        });
      }
    });

    res.status(200).json({ status: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createEvaluation = async (req, res) => {
  try {
    const { material_id, question, options, correct_answer, points } = req.body;
    const material = await Material.findByPk(material_id);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    const currentQuestions = Array.isArray(material.quiz_questions) ? [...material.quiz_questions] : [];
    const newQuestion = {
      id: currentQuestions.length + 1,
      question,
      options,
      correct_answer,
      points: Number(points) || 10
    };

    currentQuestions.push(newQuestion);
    await material.update({ quiz_questions: currentQuestions });

    res.status(201).json({ status: true, message: "Soal evaluasi berhasil ditambahkan", data: newQuestion });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { material_id, question, options, correct_answer, points } = req.body;

    let targetMaterialId = material_id;
    let questionIndex = -1;

    if (id && id.includes("_")) {
      const parts = id.split("_");
      targetMaterialId = targetMaterialId || parts[0];
      questionIndex = parseInt(parts[1], 10);
    }

    const material = await Material.findByPk(targetMaterialId);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    const currentQuestions = Array.isArray(material.quiz_questions) ? [...material.quiz_questions] : [];
    if (questionIndex >= 0 && questionIndex < currentQuestions.length) {
      currentQuestions[questionIndex] = {
        ...currentQuestions[questionIndex],
        question: question || currentQuestions[questionIndex].question,
        options: options || currentQuestions[questionIndex].options,
        correct_answer: correct_answer || currentQuestions[questionIndex].correct_answer,
        points: points !== undefined ? Number(points) : currentQuestions[questionIndex].points
      };
      await material.update({ quiz_questions: currentQuestions });
    }

    res.status(200).json({ status: true, message: "Soal evaluasi diperbarui" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.includes("_")) {
      return res.status(400).json({ status: false, message: "Invalid question id" });
    }

    const [material_id, indexStr] = id.split("_");
    const questionIndex = parseInt(indexStr, 10);

    const material = await Material.findByPk(material_id);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    const currentQuestions = Array.isArray(material.quiz_questions) ? [...material.quiz_questions] : [];
    if (questionIndex >= 0 && questionIndex < currentQuestions.length) {
      currentQuestions.splice(questionIndex, 1);
      await material.update({ quiz_questions: currentQuestions });
    }

    res.status(200).json({ status: true, message: "Soal evaluasi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAdminRankings = async (req, res) => {
  try {
    const rankings = await Ranking.findAll({
      include: [
        { model: db.Member, as: 'member', attributes: ["member_id", "full_name", "member_no"] }
      ],
      order: [
        ["total_score", "DESC"],
        ["completed_materials", "DESC"],
        ["updated_at", "ASC"]
      ]
    });
    res.status(200).json({ status: true, data: rankings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
