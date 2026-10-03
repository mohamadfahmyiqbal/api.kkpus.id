import db from "../../models/index.js";

const saveNote = async (req, res) => {
  try {
    const memberId = req.userId;
    const { material_id, note_content } = req.body;

    if (!material_id || !note_content) {
      return res.status(400).json({
        status: false,
        message: "Material ID dan konten catatan harus diisi"
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

    const [note, created] = await db.MaterialNote.findOrCreate({
      where: {
        member_id: memberId,
        material_id: material_id
      },
      defaults: {
        member_id: memberId,
        material_id: material_id,
        note_content: note_content
      }
    });

    if (!created) {
      await note.update({ note_content: note_content });
    }

    return res.status(200).json({
      status: true,
      message: "Catatan berhasil disimpan",
      data: note
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { saveNote };
