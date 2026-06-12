import db from './models/index.js';

async function rollbackRegistration(email) {
  const t = await db.sequelize.transaction();
  try {
    const member = await db.Member.findOne({ where: { email } });
    
    if (!member) {
      console.log(`Member dengan email ${email} tidak ditemukan.`);
      process.exit(1);
    }

    console.log(`Rollback pendaftaran untuk member: ${member.full_name} (${email})...`);

    // Hapus data pendaftaran dan relasinya
    await db.MemberRegistration.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.MemberBankAccount.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.MemberEmployment.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.MemberEmergencyContact.destroy({ where: { member_id: member.member_id }, transaction: t });

    // Hapus data yang mungkin terbuat saat disetujui (approval)
    await db.MemberSavingsAccount.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.Account.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.Transaction.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.BillItem.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.ActivityLog.destroy({ where: { member_id: member.member_id }, transaction: t });
    
    // Kembalikan flag is_registration_done ke 0 dan status ke Calon Anggota
    await db.Member.update(
      { 
        is_registration_done: 0,
        member_type: 'Calon Anggota',
        status_id: '5'
      }, 
      { where: { member_id: member.member_id }, transaction: t }
    );

    await t.commit();
    console.log('Rollback berhasil! Member sekarang kembali ke status "belum mendaftar".');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('Gagal melakukan rollback:', error);
    process.exit(1);
  }
}

// Gunakan email akun yang ingin di-rollback (ganti jika perlu)
rollbackRegistration('test001@gmail.com');
