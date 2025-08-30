import moment from "moment";
import MAnggota from "../../models/anggota/MAnggota.js";
import fs from "fs";
import path from "path";

export const getApprovalDetail = async (req, res) => {
  const { type, nik } = req.body;
  try {
    if (type === "pendaftaran_anggota") {
      const anggota = await MAnggota.findOne({
        where: {
          nik,
        },
        include: [
          {
            association: "detail",
          },
          {
            association: "AnggotaRoles",
          },
          {
            association: "requests",
            include: [
              {
                association: "approval",
                include: {
                  association: "approver",
                },
              },
            ],
          },
          {
            association: "bank",
          },
          {
            association: "job",
          },
          {
            association: "req",
          },
        ],
      });

      // Ambil file KTP dan foto dari folder uploads, kirimkan dalam bentuk base64
      let ktpImg = null;
      let fotoImg = null;
      try {
        if (anggota.detail && anggota.detail.ktp) {
          // Asumsi path file KTP: ./uploads/ktp/{nik}_ktp.jpg
          const ktpPath = path.resolve("./uploads/ktp", `${nik}_ktp.jpg`);
          if (fs.existsSync(ktpPath)) {
            const ktpBuffer = fs.readFileSync(ktpPath);
            ktpImg = `data:image/jpeg;base64,${ktpBuffer.toString("base64")}`;
          }
        }
        if (anggota.detail && anggota.detail.foto) {
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
        requester: {
          nama: anggota.nama,
          jenis_kelamin: anggota.detail?.jenis_kelamin,
          alamat: anggota.detail?.alamat,
          ktp: ktpImg,
          foto: fotoImg,
          no_tlp: anggota.no_tlp,
          tlp_darurat: anggota.detail?.tlp_darurat,
          hubungan: anggota.detail?.hubungan,
        },

        transaksi: {
          tgl_daftar: anggota.detail?.createdAt
            ? moment(anggota.detail.createdAt).format("YYYY-MM-DD HH:mm")
            : null,
          transaksi: null,
          invoice: null,
        },
        akun: {
          waktu_daftar: anggota.req?.createdAt,
          tipe_anggota: anggota.req?.tipe_anggota,
          roles: anggota.AnggotaRoles
            ? {
                value: anggota.AnggotaRoles.id,
                label: anggota.AnggotaRoles.nama,
              }
            : null,
          email: anggota.email,
        },
        job: anggota.job
          ? {
              pekerjaan: anggota.job.pekerjaan,
              tempat_kerja: anggota.job.tempat_kerja,
              alamat_kerja: anggota.job.alamat_kerja,
            }
          : null,
        bank: anggota.bank
          ? {
              bank: anggota.bank.bank,
              no_rekening: anggota.bank.no_rekening,
              nama_nasabah: anggota.bank.nama_nasabah,
            }
          : null,
        approval: anggota.requests,
      };

      return res.status(200).json(send);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
