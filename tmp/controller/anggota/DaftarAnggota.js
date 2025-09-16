import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import MAnggota from "../../models/anggota/MAnggota.js";
import MAnggotaDetail from "../../models/anggota/MAnggotaDetail.js";
import MAnggotaJob from "../../models/anggota/MAnggotaJob.js";
import MAnggotaBank from "../../models/anggota/MAnggotaBank.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import MNotification from "../../models/notifikasi/MNotification.js";
import { MApprovalFlow } from "../../models/index.js";
import MRequest from "../../models/transaksi/MRequest.js";

/**
 * Kompres dan simpan gambar. Mengembalikan objek metadata.
 * Membuat folder jika belum ada.
 */
async function compressAndSaveImage(file, folderPath, filename) {
  if (!file || !file.buffer) throw new Error("File tidak valid");

  // pastikan folder path ada
  await fs.mkdir(folderPath, { recursive: true });

  const outputPath = path.join(folderPath, filename);

  const buffer = await sharp(file.buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  await fs.writeFile(outputPath, buffer);

  return {
    mimeType: "image/jpeg",
    size: buffer.length,
    // url relatif untuk akses publik (sesuaikan jika server serve path lain)
    url: `/uploads/${path.basename(folderPath)}/${filename}`,
    path: outputPath, // path fisik, supaya bisa cleanup jika rollback
    originalName: file.originalname || filename,
  };
}

/**
 * Controller: daftar anggota
 */
export async function DaftarAnggota(req, res) {
  // Validasi body minimal
  const {
    nia,
    nik,
    nama,
    jenis_anggota,
    jenis_kelamin,
    tlp_darurat,
    hubungan,
    alamat,
    pekerjaan,
    tempat_kerja,
    alamat_kerja,
    bank,
    no_rekening,
    nama_nasabah,
  } = req.body ?? {};

  if (!nia) {
    return res.status(400).json({ error: "Parameter 'nia' wajib." });
  }

  const fotoFile = req.files?.foto?.[0];
  const ktpFile = req.files?.ktp?.[0];

  if (!fotoFile || !ktpFile) {
    return res.status(400).json({
      error: !fotoFile ? "Foto wajib diupload." : "KTP wajib diupload.",
    });
  }

  const sequelize = MAnggota.sequelize;
  const savedFiles = []; // track file paths untuk cleanup jika rollback
  const token = `REG${Math.random().toString(36).substr(2, 10)}`;
  const transaction = await sequelize.transaction();
  try {
    // cari anggota berdasarkan `nia` (sesuaikan jika model berbeda)
    const anggota = await MAnggota.findOne({
      where: { nik: nia },
      transaction,
    });
    if (!anggota) {
      await transaction.rollback();
      return res.status(404).json({ error: "Data anggota tidak ditemukan." });
    }
    // ambil flow approval
    const approvalFlows = await MApprovalFlow.findAll({
      where: { type: "pendaftaran_anggota" },
      order: [["level", "ASC"]],
      transaction,
    });
    // buat folder per nia supaya terorganisir
    const fotoFolder = path.resolve("./uploads/foto");
    const ktpFolder = path.resolve("./uploads/ktp");
    const fotoFilename = `${nia}_foto.jpg`;
    const ktpFilename = `${nia}_ktp.jpg`;
    // kompres & simpan gambar
    const fotoData = await compressAndSaveImage(
      fotoFile,
      fotoFolder,
      fotoFilename
    );
    const ktpData = await compressAndSaveImage(ktpFile, ktpFolder, ktpFilename);
    // track file-path untuk cleanup bila rollback
    savedFiles.push(fotoData.path, ktpData.path);
    // upsert detail pekerjaan / bank / detail anggota
    await MAnggotaDetail.upsert(
      {
        token: nia,
        nik,
        jenis_kelamin,
        alamat,
        foto: fotoData.url,
        foto_mimeType: fotoData.mimeType,
        ktp: ktpData.url,
        ktp_mimeType: ktpData.mimeType,
        tlp_darurat,
        hubungan,
        updatedAt: new Date(),
      },
      { transaction }
    );

    await MAnggotaJob.upsert(
      {
        token: nia,
        pekerjaan,
        tempat_kerja,
        alamat_kerja,
        updated_at: new Date(),
      },
      { transaction }
    );

    await MAnggotaBank.upsert(
      {
        token: nia,
        bank,
        no_rekening,
        nama_nasabah,
        updated_at: new Date(),
      },
      { transaction }
    );

    await MRequest.upsert(
      {
        token: token,
        nik: nia,
        tipe_request: "pendaftaran_anggota",
        tipe_anggota: Number(jenis_anggota),
        status_payment: null,
        status_approval: null,
        updatedAt: new Date(),
      },
      { transaction }
    );

    // Buat request approval — lakukan sequentially untuk menjamin konsistensi
    if (Array.isArray(approvalFlows) && approvalFlows.length) {
      for (const flow of approvalFlows) {
        await MApprovalRequest.upsert(
          {
            requester_id: nia,
            token: token,
            type: "pendaftaran_anggota",
            flow: flow.level ?? flow.flow ?? null,
            approver: flow.approver_id,
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction }
        );
      }
    }
    // buat notifikasi
    await MNotification.create(
      {
        user_id: nia,
        type: "pendaftaran_anggota",
        title: "Pendaftaran Anggota Baru",
        body: `Pendaftaran anggota atas nama ${
          nama ?? "-"
        } telah berhasil diajukan dan menunggu persetujuan.`,
        data: {
          nama,
          alamat,
          pekerjaan,
          tempat_kerja,
          alamat_kerja,
          bank,
          no_rekening,
          nama_nasabah,
        },
        is_read: false,
        created_at: new Date(),
      },
      { transaction }
    );
    // commit semua perubahan DB
    await transaction.commit();
    return res.json({
      success: true,
      message: "Pendaftaran anggota berhasil.",
      data: {
        nama,
        alamat,
        foto: {
          url: fotoData.url,
          mimeType: fotoData.mimeType,
          size: fotoData.size,
        },
        ktp: {
          url: ktpData.url,
          mimeType: ktpData.mimeType,
          size: ktpData.size,
        },
        pekerjaan,
        tempat_kerja,
        alamat_kerja,
        bank,
        no_rekening,
        nama_nasabah,
      },
    });
  } catch (error) {
    // rollback DB
    try {
      await transaction.rollback();
    } catch (e) {
      // ignore rollback error, lanjut cleanup
    }

    // cleanup file yang sudah tersimpan
    for (const p of savedFiles) {
      try {
        if (p && existsSync(p)) {
          await fs.unlink(p);
        }
      } catch (e) {
        // tidak gagal proses utama karena cleanup gagal
        console.warn("Cleanup file gagal:", p, e);
      }
    }

    console.error("Error DaftarAnggota:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
}
