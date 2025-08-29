import moment from "moment";
import MAnggota from "../../models/anggota/MAnggota.js";

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
            association: "detail", // pastikan alias relasi sesuai di models/index.js
          },
          {
            association: "requests", // relasi ke MApprovalRequest, alias di models/index.js
          },
          {
            association: "bank", // relasi ke AnggotaBank, pastikan alias relasi sudah ada di models/index.js
          },
          {
            association: "job", // relasi ke AnggotaJob, pastikan alias relasi sudah ada di models/index.js
          },
          {
            association: "req", // relasi ke AnggotaJob, pastikan alias relasi sudah ada di models/index.js
          },
        ],
      });
      console.log(anggota);
      const send = {
        requester: {
          nama: anggota.nama,
          jenis_kelamin: anggota.detail.jenis_kelamin,
          alamat: anggota.detail.alamat,
          ktp: anggota.detail.ktp,
          foto: anggota.detail.foto,
          no_tlp: anggota.no_tlp,
          tlp_darurat: anggota.detail.tlp_darurat,
          hubungan: anggota.detail.hubungan,
        },

        transaksi: {
          tgl_daftar: moment(anggota.detail.createdAt).format(
            "YYYY-MM-DD HH:mm"
          ),
          transaksi: null,
          invoice: null,
        },
        akun: {
          waktu_daftar: anggota.req.createdAt,
          tipe_anggota: anggota.req.tipe_anggota,
          roles: anggota.roles,
          email: anggota.email,
        },
        job: {
          pekerjaan: anggota.job.pekerjaan,
          tempat_Kerja: anggota.job.tempat_Kerja,
          alamat_kerja: anggota.job.alamat_kerja,
        },
        bank: {
          bank: anggota.bank.bank,
          no_rekening: anggota.bank.no_rekening,
          nama_nasabah: anggota.bank.nama_nasabah,
        },
        approval: anggota.requests,
      };
      // console.log(send);
      return res.status(200).json(send);
    }
  } catch (error) {
    console.log(error);
  }
};
