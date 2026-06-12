import db from './models/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    console.log('Seeding member_status...');
    const memberStatuses = [
      { status_id: '1', status_name: 'Calon Anggota' },
      { status_id: '2', status_name: 'Pengawas' },
      { status_id: '3', status_name: 'Ketua' },
      { status_id: '4', status_name: 'Bendahara' },
      { status_id: '5', status_name: 'Anggota Reguler' },
      { status_id: '6', status_name: 'Anggota Luar Biasa' },
    ];
    await db.MemberStatus.bulkCreate(memberStatuses, { ignoreDuplicates: true });

    console.log('Seeding user_roles...');
    // We can map user roles identically to member_status for simplicity, or use specific strings.
    const userRoles = [
      { role_id: '1', role_name: 'Calon Anggota' },
      { role_id: '2', role_name: 'Pengawas' },
      { role_id: '3', role_name: 'Ketua' },
      { role_id: '4', role_name: 'Bendahara' },
      { role_id: '5', role_name: 'Anggota Reguler' },
      { role_id: '6', role_name: 'Anggota Luar Biasa' },
    ];
    await db.UserRole.bulkCreate(userRoles, { ignoreDuplicates: true });

    console.log('Creating Admin/Pengurus Members...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const members = [
      {
        member_id: uuidv4(),
        member_no: 'PNGWS-001',
        full_name: 'Bapak Pengawas',
        email: 'pengawas@koperasi.com',
        phone_number: '081234567801',
        password_hash: passwordHash,
        status_id: '2',
      },
      {
        member_id: uuidv4(),
        member_no: 'KTU-001',
        full_name: 'Bapak Ketua',
        email: 'ketua@koperasi.com',
        phone_number: '081234567802',
        password_hash: passwordHash,
        status_id: '3',
      },
      {
        member_id: uuidv4(),
        member_no: 'BND-001',
        full_name: 'Ibu Bendahara',
        email: 'bendahara@koperasi.com',
        phone_number: '081234567803',
        password_hash: passwordHash,
        status_id: '4',
      }
    ];
    await db.Member.bulkCreate(members, { ignoreDuplicates: true });

    console.log('Seeding member_role_assignments...');
    const assignments = [
      { member_role_id: uuidv4(), member_id: members[0].member_id, role_id: '2' },
      { member_role_id: uuidv4(), member_id: members[1].member_id, role_id: '3' },
      { member_role_id: uuidv4(), member_id: members[2].member_id, role_id: '4' },
    ];
    await db.MemberRoleAssignment.bulkCreate(assignments, { ignoreDuplicates: true });

    console.log('Seeding approval_flows & approval_steps...');
    // Flow 1: Pendaftaran Anggota
    const flow1 = await db.ApprovalFlow.create({ approval_flow_id: uuidv4(), entity_ref: 'member_registrations', entity_id: uuidv4(), flow_name: 'Pendaftaran Anggota' });
    await db.ApprovalStep.bulkCreate([
      { step_id: uuidv4(), approval_flow_id: flow1.approval_flow_id, step_order: 1, role_id: '2', step_name: 'Review Pengawas' },
      { step_id: uuidv4(), approval_flow_id: flow1.approval_flow_id, step_order: 2, role_id: '3', step_name: 'Approval Ketua' },
    ]);

    // Flow 2: Simpanan
    const flow2 = await db.ApprovalFlow.create({ approval_flow_id: uuidv4(), entity_ref: 'savings', entity_id: uuidv4(), flow_name: 'Simpanan' });
    await db.ApprovalStep.bulkCreate([
      { step_id: uuidv4(), approval_flow_id: flow2.approval_flow_id, step_order: 1, role_id: '2', step_name: 'Review Pengawas' },
      { step_id: uuidv4(), approval_flow_id: flow2.approval_flow_id, step_order: 2, role_id: '3', step_name: 'Approval Ketua' },
    ]);

    // Flow 3: Pembiayaan (Yg lainnya)
    const flow3 = await db.ApprovalFlow.create({ approval_flow_id: uuidv4(), entity_ref: 'financing_applications', entity_id: uuidv4(), flow_name: 'Pembiayaan' });
    await db.ApprovalStep.bulkCreate([
      { step_id: uuidv4(), approval_flow_id: flow3.approval_flow_id, step_order: 1, role_id: '2', step_name: 'Review Pengawas' },
      { step_id: uuidv4(), approval_flow_id: flow3.approval_flow_id, step_order: 2, role_id: '3', step_name: 'Approval Ketua' },
      { step_id: uuidv4(), approval_flow_id: flow3.approval_flow_id, step_order: 3, role_id: '4', step_name: 'Pencairan Bendahara' },
    ]);

    // Flow 4: Penarikan Simpanan
    const flow4 = await db.ApprovalFlow.create({ approval_flow_id: uuidv4(), entity_ref: 'savings_withdrawals', entity_id: uuidv4(), flow_name: 'Penarikan Simpanan' });
    await db.ApprovalStep.bulkCreate([
      { step_id: uuidv4(), approval_flow_id: flow4.approval_flow_id, step_order: 1, role_id: '2', step_name: 'Review Pengawas' },
      { step_id: uuidv4(), approval_flow_id: flow4.approval_flow_id, step_order: 2, role_id: '3', step_name: 'Approval Ketua' },
      { step_id: uuidv4(), approval_flow_id: flow4.approval_flow_id, step_order: 3, role_id: '4', step_name: 'Pencairan Bendahara' },
    ]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
