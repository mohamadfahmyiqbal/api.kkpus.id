import bcrypt from 'bcrypt';
import db from '../../../models/index.js';

const MemberRegistration = db.MemberRegistration;
const Member = db.Member; // Menggunakan model Member

/**
 * Fungsi pembantu untuk membuat Member No. dalam format 00DDMMYYHHmm
 */
const generateMemberNo = () => {
 const now = new Date();
 const pad = (num) => String(num).padStart(2, '0');

 const day = pad(now.getDate());
 const month = pad(now.getMonth() + 1);
 const year = pad(now.getFullYear() % 100);
 const hour = pad(now.getHours());
 const minute = pad(now.getMinutes());

 return `00${day}${month}${year}${hour}${minute}`;
};

export const registerAccount = async (req, res) => {
 const { name, email, password, phone_number } = req.body;
 let transaction;

 try {
  // 1. Cek duplikasi email di tabel pendaftaran
  const existingRegistration = await MemberRegistration.findOne({
   where: { email: email }
  });

  if (existingRegistration) {
   return res.status(409).json({
    success: false,
    message: "Email sudah terdaftar. Silakan login atau gunakan email lain."
   });
  }

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // 3. Generate Member Number
  const memberNo = generateMemberNo();

  // =========================================================
  // 4. MEMULAI TRANSAKSI: Memastikan kedua insert berhasil
  // =========================================================
  transaction = await db.sequelize.transaction();

  // 4a. Buat Record di Tabel Induk: 'members'
  // CATATAN: Field status_id (FK) harus diisi ID yang valid dari tabel member_status
  const newMember = await Member.create({
   full_name: name,
   email: email,
   phone_number: phone_number,
   member_no: memberNo, // <-- String ID (00DDMMYYHHmm)
   join_date: new Date(),
   member_type: 'reguler', // ASUMSI: default type
   status_id: 1, // ASUMSI: ID 3 adalah status 'Aktif'
   // nik_ktp, address, dan gender dibiarkan null atau diisi default
  }, { transaction });

  // Ambil Primary Key (BIGINT) yang dibuat oleh DB
  const memberId = newMember.member_id;

  // 4b. Buat Record di Tabel Anak: 'member_registrations'
  await MemberRegistration.create({
   name,
   email,
   password_hash,
   phone_number,

   registration_status: 'aktif', // Status aktif
   member_id: memberId, // <-- FK merujuk ke PK tabel members
  }, { transaction });

  // 5. Commit Transaksi
  await transaction.commit();

  // 6. Respon sukses
  return res.status(201).json({
   success: true,
   message: "Pendaftaran dan aktivasi Member berhasil!",
   data: {
    registration_email: email,
    member_id_numeric: memberId,
    member_no: memberNo,
    registration_status: 'aktif',
   },
  });

 } catch (error) {
  // 7. Rollback Transaksi
  if (transaction) {
   await transaction.rollback();
  }

  console.error("Error during account registration:", error);

  return res.status(500).json({
   success: false,
   message: "Terjadi kesalahan server saat mendaftar. Data tidak disimpan."
  });
 }
};