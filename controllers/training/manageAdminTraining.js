import db from "../../models/index.js";
const { Curriculum, Material, Evaluation, Ranking } = db;

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
    const materials = await Material.findAll({ order: [["sequence_no", "ASC"]] });
    res.status(200).json({ status: true, data: materials });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { curriculum_id, material_name, material_type, content, media_url, sequence_no } = req.body;
    const material = await Material.create({
      curriculum_id, material_name, material_type, content, media_url, sequence_no
    });
    res.status(201).json({ status: true, message: "Material created", data: material });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { curriculum_id, material_name, material_type, content, media_url, sequence_no } = req.body;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ status: false, message: "Material not found" });

    await material.update({ curriculum_id, material_name, material_type, content, media_url, sequence_no });
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
    const evaluations = await Evaluation.findAll({ order: [["created_at", "DESC"]] });
    res.status(200).json({ status: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createEvaluation = async (req, res) => {
  try {
    const { material_id, question, options, correct_answer, points } = req.body;
    const evaluation = await Evaluation.create({ material_id, question, options, correct_answer, points });
    res.status(201).json({ status: true, message: "Evaluation created", data: evaluation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { material_id, question, options, correct_answer, points } = req.body;
    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) return res.status(404).json({ status: false, message: "Evaluation not found" });

    await evaluation.update({ material_id, question, options, correct_answer, points });
    res.status(200).json({ status: true, message: "Evaluation updated", data: evaluation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) return res.status(404).json({ status: false, message: "Evaluation not found" });

    await evaluation.destroy();
    res.status(200).json({ status: true, message: "Evaluation deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAdminRankings = async (req, res) => {
  try {
    const rankings = await Ranking.findAll({
      include: [
        { model: db.User, as: 'user', attributes: ["user_id", "nama_lengkap", "email", "profile_picture"] }
      ],
      order: [
        ["total_score", "DESC"],
        ["materials_completed", "DESC"],
        ["updated_at", "ASC"]
      ]
    });
    res.status(200).json({ status: true, data: rankings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
