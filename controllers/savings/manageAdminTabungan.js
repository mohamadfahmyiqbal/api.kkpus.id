import db from "../../models/index.js";

// GET /programs (Untuk Frontend Member)
export const getAvailablePrograms = async (req, res) => {
  try {
    const programs = await db.SavingTarget.findAll({
      order: [["created_at", "DESC"]]
    });
    return res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error("Error getAvailablePrograms:", error);
    return res.status(500).json({ success: false, message: error.message || "Terjadi kesalahan sistem." });
  }
};

// GET /admin/programs
export const getTabunganPrograms = async (req, res) => {
  try {
    const programs = await db.SavingTarget.findAll({
      order: [["created_at", "DESC"]]
    });
    return res.status(200).json({
      success: true,
      message: "Daftar program tabungan berhasil diambil",
      data: programs
    });
  } catch (error) {
    console.error("Error getTabunganPrograms:", error);
    return res.status(500).json({ success: false, message: error.message || "Terjadi kesalahan sistem." });
  }
};

// POST /admin/programs
export const createTabunganProgram = async (req, res) => {
  try {
    const { target_name, category, target_amount, term_months, akad_type } = req.body;
    
    if (!target_name || !category) {
      return res.status(400).json({ success: false, message: "Nama dan Kategori program harus diisi" });
    }

    const newProgram = await db.SavingTarget.create({
      target_name,
      category,
      target_amount,
      term_months,
      akad_type: akad_type || "Mudharabah"
    });

    return res.status(201).json({
      success: true,
      message: "Program tabungan berhasil dibuat",
      data: newProgram
    });
  } catch (error) {
    console.error("Error createTabunganProgram:", error);
    return res.status(500).json({ success: false, message: error.message || "Terjadi kesalahan sistem." });
  }
};

// PUT /admin/programs/:id
export const updateTabunganProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { target_name, category, target_amount, term_months, akad_type } = req.body;

    const program = await db.SavingTarget.findByPk(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program tabungan tidak ditemukan" });
    }

    await program.update({
      target_name: target_name || program.target_name,
      category: category || program.category,
      target_amount: target_amount !== undefined ? target_amount : program.target_amount,
      term_months: term_months !== undefined ? term_months : program.term_months,
      akad_type: akad_type || program.akad_type
    });

    return res.status(200).json({
      success: true,
      message: "Program tabungan berhasil diperbarui",
      data: program
    });
  } catch (error) {
    console.error("Error updateTabunganProgram:", error);
    return res.status(500).json({ success: false, message: error.message || "Terjadi kesalahan sistem." });
  }
};

// DELETE /admin/programs/:id
export const deleteTabunganProgram = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cek apakah sudah ada peserta
    const participants = await db.MemberSavingTarget.count({ where: { saving_target_id: id } });
    if (participants > 0) {
      return res.status(400).json({ success: false, message: "Tidak dapat menghapus program yang sudah memiliki peserta" });
    }

    const program = await db.SavingTarget.findByPk(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program tabungan tidak ditemukan" });
    }

    await program.destroy();

    return res.status(200).json({
      success: true,
      message: "Program tabungan berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleteTabunganProgram:", error);
    return res.status(500).json({ success: false, message: error.message || "Terjadi kesalahan sistem." });
  }
};
