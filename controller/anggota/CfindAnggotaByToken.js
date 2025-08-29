import path from "path";
import fs from "fs";
import MAnggota from "../../models/anggota/MAnggota.js";
import MAnggotaDetail from "../../models/anggota/MAnggotaDetail.js";

export const FindAnggotaByToken = async (req, res) => {
  let token = null;

  // Ambil token dari cookie atau header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  const { ret } = req.body || {};

  try {
    const user = await MAnggota.findOne({
      where: { token },
      attributes: { exclude: ["password", "token"] },
      include: [
        {
          model: MAnggotaDetail,
          as: "detail",
          attributes: ["foto"], // hanya ambil kolom foto
        },
      ],
    });

    if (!user) {
      if (ret === "ret") {
        return { message: "Anggota tidak ditemukan" };
      }
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    // Ambil foto dari folder uploads/foto, convert ke base64
    let userObj = user.toJSON ? user.toJSON() : user;
    let sendUserObj = { ...userObj };

    if (userObj.detail && userObj.detail.foto) {
      // Path file foto, misal: uploads/foto/namafile.jpg
      const fotoPath = path.join(process.cwd(), userObj.detail.foto);

      try {
        if (fs.existsSync(fotoPath)) {
          const fotoBuffer = fs.readFileSync(fotoPath);
          const fotoBase64 = fotoBuffer.toString("base64");
          sendUserObj.foto = fotoBase64;
        } else {
          sendUserObj.foto = null;
        }
      } catch (err) {
        sendUserObj.foto = null;
      }
    } else {
      sendUserObj.foto = null;
    }
    if (ret === "ret") {
      return sendUserObj;
    }

    return res.status(200).json(sendUserObj);
  } catch (error) {
    console.log(error);

    if (ret === "ret") {
      return { message: `Server Error ${error}` };
    }
    return res.status(500).json({ message: `Server Error ${error}` });
  }
};
