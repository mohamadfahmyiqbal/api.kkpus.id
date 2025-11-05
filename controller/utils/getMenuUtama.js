import MMenuUtama from "../../models/MMenuUtama.js";
import fs from "fs";
import path from "path";

export const getMenuUtama = async (req, res) => {
  try {
    const menuItems = await MMenuUtama.findAll({
      where: { status_aktif: true },
      order: [["urutan", "ASC"]],
      attributes: ["id_menu", "nama_menu", "ikon", "deskripsi"],
    });

    // Tambahkan path gambar untuk setiap menu item
    const menuItemsWithImages = menuItems.map((item) => {
      const imagePath = path.join("uploads", "menu", item.ikon);
      let imageBase64 = null;

      try {
        // Coba baca file gambar dan konversi ke base64
        if (fs.existsSync(imagePath)) {
          const imageBuffer = fs.readFileSync(imagePath);
          imageBase64 = `data:image/png;base64,${imageBuffer.toString(
            "base64"
          )}`;
        }
      } catch (imageError) {
        console.error(
          `Gagal membaca gambar untuk menu ${item.nama_menu}:`,
          imageError
        );
      }

      return {
        ...item.dataValues,
        gambar: imageBase64,
      };
    });

    return res.status(200).json(menuItemsWithImages);
  } catch (error) {
    console.error("Error saat mengambil menu utama:", error);
    return res.status(500).json({
      message: `Gagal mengambil menu utama ${error.message}`,
    });
  }
};
