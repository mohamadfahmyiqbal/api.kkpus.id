import db from './models/index.js';

async function rollbackApproval(email) {
  const t = await db.sequelize.transaction();
  try {
    const member = await db.Member.findOne({ where: { email } });
    
    if (!member) {
      console.log(`Member dengan email ${email} tidak ditemukan.`);
      process.exit(1);
    }

    console.log(`Rollback approval untuk member: ${member.full_name} (${email})...`);

    const reg = await db.MemberRegistration.findOne({ where: { member_id: member.member_id } });
    
    if (!reg) {
      console.log('Registrasi tidak ditemukan.');
      process.exit(1);
    }

    // Hapus log approval
    await db.Approval.destroy({ 
      where: { entity_ref: 'members', entity_id: reg.registration_id }, 
      transaction: t 
    });
    
    await db.EntityStepApproval.destroy({ 
      where: { entity_ref: 'members', entity_id: reg.registration_id }, 
      transaction: t 
    });

    // Cari step pertama
    const flow = await db.ApprovalFlow.findOne({ 
      where: { entity_ref: 'members' },
      include: [{ model: db.ApprovalStep, as: 'steps' }]
    });
    
    let firstStepId = null;
    if (flow && flow.steps) {
      const firstStep = flow.steps.find(s => s.step_order === 1);
      if (firstStep) firstStepId = firstStep.approval_step_id;
    }

    // Kembalikan status registrasi
    await db.MemberRegistration.update(
      { 
        final_status: 'PENDING', 
        current_step_id: firstStepId,
        is_approved_pengawas: false,
        is_approved_ketua: false
      }, 
      { where: { registration_id: reg.registration_id }, transaction: t }
    );

    // Kembalikan status member ke inactive
    await db.Member.update(
      { status: 'inactive' }, 
      { where: { member_id: member.member_id }, transaction: t }
    );

    await t.commit();
    console.log('Rollback approval berhasil! Member sekarang kembali ke status "menunggu persetujuan".');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('Gagal melakukan rollback:', error);
    process.exit(1);
  }
}

rollbackApproval('test001@gmail.com');
