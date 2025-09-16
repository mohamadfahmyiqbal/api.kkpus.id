import moment from "moment";
import MAnggota from "../../models/anggota/MAnggota.js";
import fs from "fs";
import path from "path";
import { MRequest } from "../../models/index.js";

export const getApprovalDetail = async (req, res) => {
  const { type, nik } = req.body;
  try {
    if (type === "pendaftaran_anggota") {
      const request = await MRequest.findOne({
        where: {
          nik,
          tipe_request: type,
        },
        include: [
          {
            association: "anggota",
            attributes: { exclude: ["password", "token"] },
            include: [
              {
                association: "detail",
              },
              {
                association: "bank",
              },
              {
                association: "job",
              },
            ],
          },
          {
            association: "RequestApproval",
            include: [
              {
                association: "requesterAnggota",
                attributes: { exclude: ["password", "token"] },
              },
              {
                association: "approverAnggota",
                attributes: { exclude: ["password", "token"] },
              },
            ],
            separate: true,
            order: [["flow", "ASC"]],
          },
        ],
      });
      // console.log(request.RequestApproval);

      let ktpImg = null;
      let fotoImg = null;
      try {
        if (request.anggota.detail && request.anggota.detail.ktp) {
          // Asumsi path file KTP: ./uploads/ktp/{nik}_ktp.jpg
          const ktpPath = path.resolve("./uploads/ktp", `${nik}_ktp.jpg`);
          if (fs.existsSync(ktpPath)) {
            const ktpBuffer = fs.readFileSync(ktpPath);
            ktpImg = `data:image/jpeg;base64,${ktpBuffer.toString("base64")}`;
          }
        }
        if (request.anggota.detail && request.anggota.detail.foto) {
          // Asumsi path file foto: ./uploads/foto/{nik}_foto.jpg
          const fotoPath = path.resolve("./uploads/foto", `${nik}_foto.jpg`);
          if (fs.existsSync(fotoPath)) {
            const fotoBuffer = fs.readFileSync(fotoPath);
            fotoImg = `data:image/jpeg;base64,${fotoBuffer.toString("base64")}`;
          }
        }
      } catch (err) {
        // Jika gagal baca file, biarkan null
        ktpImg = null;
        fotoImg = null;
      }

      // Masukkan ktpImg dan fotoImg ke dalam request.anggota
      let plainRequest = request.toJSON();
      plainRequest.anggota.ktpImg = ktpImg;
      plainRequest.anggota.fotoImg = fotoImg;

      return res.status(200).json(plainRequest);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
