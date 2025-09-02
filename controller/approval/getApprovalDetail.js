import moment from "moment";
import MAnggota from "../../models/anggota/MAnggota.js";
import fs from "fs";
import path from "path";
import { MAnggotaReq } from "../../models/index.js";

export const getApprovalDetail = async (req, res) => {
  const { type, nik } = req.body;
  try {
    if (type === "pendaftaran_anggota") {
      const request = await MAnggotaReq.findOne({
        where: {
          nik,
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
                association: "requestsApproval",
                include: [
                  {
                    association: "requesterApproval",
                    attributes: { exclude: ["password", "token"] },
                  },
                  {
                    association: "flows",
                  },
                  {
                    association: "approval",
                    include: [
                      {
                        association: "approver",
                        attributes: { exclude: ["password", "token"] },
                      },
                    ],
                  },
                ],
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
            association: "AnggotaRoles",
          },
        ],
        // raw: true,
        // nest: true,
      });

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

      const send = {
        request: {
          id: request.id,
          token: request.token,
          nik: request.nik,
          tipe_anggota: request.tipe_anggota,
          status_payment: request.status_payment,
          status_approval: request.status_approval,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
        },
        requester: {
          nama: request.anggota.nama,
          jenis_kelamin: request.anggota.detail?.jenis_kelamin,
          alamat: request.anggota.detail?.alamat,
          nikKtp: request.anggota.detail.nik,
          ktp: ktpImg,
          foto: fotoImg,
          no_tlp: request.anggota.no_tlp,
          tlp_darurat: request.anggota.detail?.tlp_darurat,
          hubungan: request.anggota.detail?.hubungan,
        },
        akun: {
          waktu_daftar: request?.createdAt,
          tipe_anggota: request?.tipe_anggota,
          roles: request.AnggotaRoles
            ? {
                value: request.AnggotaRoles.id,
                label: request.AnggotaRoles.nama,
              }
            : null,
          email: request.anggota.email,
        },
        job: request.anggota.job
          ? {
              pekerjaan: request.anggota.job.pekerjaan,
              tempat_kerja: request.anggota.job.tempat_kerja,
              alamat_kerja: request.anggota.job.alamat_kerja,
            }
          : null,
        bank: request.anggota.bank
          ? {
              bank: request.anggota.bank.bank,
              no_rekening: request.anggota.bank.no_rekening,
              nama_nasabah: request.anggota.bank.nama_nasabah,
            }
          : null,
        approval: request.anggota.requestsApproval,
      };
      return res.status(200).json(send);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
