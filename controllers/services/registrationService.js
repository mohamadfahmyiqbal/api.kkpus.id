// 📁 services/registrationService.js (KODE FINAL)

import db from "../models/index.js";

const { MemberRegistration, Member } = db;

/**
 * Memproses aktivasi member dan pendaftaran setelah pembayaran berhasil (SETTLED).
 * @param {number} memberId - ID member yang perlu diupdate.
 * @param {number} billId - ID tagihan yang terkait (untuk mencari pendaftaran).
 * @param {object} transactionDb - Objek transaksi Sequelize yang sedang berjalan.
 */
export const activateMember = async (memberId, billId, transactionDb) => {
  console.log(
    `[RegistrationService] Memulai proses aktivasi member ID ${memberId} untuk bill ID ${billId}`
  );

  // 0. Ambil data MemberRegistration yang terkait
  // Ini penting untuk mendapatkan member_type
  const registrationRecord = await MemberRegistration.findOne({
    where: {
      bill_id: billId,
      member_id: memberId,
      registration_status: "menunggu_pembayaran",
    },
    transaction: transactionDb,
  });

  if (!registrationRecord) {
    console.warn(
      `[RegistrationService] Record Member Registration untuk bill ${billId} tidak ditemukan, status sudah aktif, atau belum menunggu_pembayaran.`
    );
    // Biarkan transaksi berlanjut (tetapi tidak ada update di sini)
    return { memberUpdated: false, registrationUpdated: false };
  }

  // 🛑 Dapatkan member_type dari record pendaftaran
  const memberTypeFromRegistration = registrationRecord.member_type;

  // LOGIKA STATUS_ID:
  // Karena tabel member_status tidak tersedia, kita ASUMSIKAN
  // bahwa Member yang aktif selalu memiliki status_id = 1.
  // Jika logika Anda lebih kompleks, Anda harus menambahkan query
  // ke tabel MemberStatus di sini (di luar blok update).
  let newStatusId = 1;

  // 1. UPDATE STATUS DI TABEL member_registrations
  const [rowsUpdatedRegistration] = await MemberRegistration.update(
    { registration_status: "active" },
    {
      where: {
        bill_id: billId,
        member_id: memberId,
        registration_status: "menunggu_pembayaran",
      },
      transaction: transactionDb,
    }
  );

  // 2. UPDATE STATUS DI TABEL member
  const [rowsUpdatedMember] = await Member.update(
    {
      // 🛑 status_id diupdate menjadi 1 (Active)
      status_id: newStatusId,
      // 🛑 member_type diupdate sesuai dengan yang dibayar
      member_type: memberTypeFromRegistration,
    },
    {
      where: { member_id: memberId },
      transaction: transactionDb,
    }
  );

  console.log(
    `[RegistrationService] Member ID ${memberId} berhasil diupdate. ${rowsUpdatedMember} baris di Member dan ${rowsUpdatedRegistration} baris di MemberRegistration diupdate.`
  );

  return {
    memberUpdated: rowsUpdatedMember > 0,
    registrationUpdated: rowsUpdatedRegistration > 0,
  };
};
