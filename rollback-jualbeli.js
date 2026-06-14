import db from './models/index.js';

async function rollbackJualBeli(email) {
  const t = await db.sequelize.transaction();
  try {
    const member = await db.Member.findOne({ where: { email } });
    
    if (!member) {
      console.log(`Member dengan email ${email} tidak ditemukan.`);
      process.exit(1);
    }

    console.log(`Rollback proses Jual Beli untuk member: ${member.full_name} (${email})...`);

    const financingApps = await db.FinancingApplication.findAll({ 
      where: { member_id: member.member_id },
      transaction: t
    });

    if (!financingApps.length) {
      console.log('Tidak ada pengajuan Jual Beli / Pembiayaan untuk member ini.');
      process.exit(1);
    }

    for (const app of financingApps) {
      const financingIdStr = String(app.financing_id);
      
      // Hapus log approval
      if (db.Approval) {
        await db.Approval.destroy({ 
          where: { entity_ref: 'financing_applications', entity_id: financingIdStr }, 
          transaction: t 
        });
      }
      
      if (db.EntityStepApproval) {
        await db.EntityStepApproval.destroy({ 
          where: { entity_ref: 'financing_applications', entity_id: financingIdStr }, 
          transaction: t 
        });
      }
    }

    // Hapus data transaksi dan tagihan (Setoran & Pembayaran)
    await db.Transaction.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.BillItem.destroy({ where: { member_id: member.member_id }, transaction: t });
    await db.Bill.destroy({ where: { member_id: member.member_id }, transaction: t });

    // Hapus aplikasi pembiayaan
    await db.FinancingApplication.destroy({ 
      where: { member_id: member.member_id }, 
      transaction: t 
    });

    await t.commit();
    console.log('Rollback Jual Beli berhasil! Data dari pengajuan hingga setoran telah dihapus.');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('Gagal melakukan rollback:', error);
    process.exit(1);
  }
}

// Gunakan email akun yang ingin di-rollback (ganti jika perlu)
rollbackJualBeli('test001@gmail.com');
