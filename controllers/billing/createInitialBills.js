// 📁 src/utils/billing/createInitialBills.js (Modul Utilitas Global)

import db from "../../models/index.js";
const { Member, Bill } = db;

// ASUMSI KONSTANTA TAGIHAN
const IURAN_WAJIB_AMOUNT = 1000000;
const IURAN_BULANAN_AMOUNT = 50000;
const BILL_STATUS_PENDING = 'PENDING';
const DUE_DATE_OFFSET_DAYS = 7;

export const createInitialBills = async (memberId, t) => {
 try {
  const updatedMember = await Member.findOne({
   where: { member_id: memberId },
   attributes: ['member_no'],
   transaction: t,
  });

  if (!updatedMember || !updatedMember.member_no) {
   throw new Error(`Gagal mengambil Member No untuk member ID ${memberId}.`);
  }

  const memberNo = updatedMember.member_no;
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + DUE_DATE_OFFSET_DAYS);

  const billsToCreate = [
   // Tagihan 1: Setoran Wajib/Pangkal
   {
    member_no: memberNo,
    description: 'Setoran Wajib/Pangkal Pendaftaran Anggota',
    amount: IURAN_WAJIB_AMOUNT,
    due_date: dueDate,
    status: BILL_STATUS_PENDING,
   },
   // Tagihan 2: Setoran Bulan Berjalan
   {
    member_no: memberNo,
    description: 'Iuran Anggota Bulan Berjalan',
    amount: IURAN_BULANAN_AMOUNT,
    due_date: dueDate,
    status: BILL_STATUS_PENDING,
   },
  ];

  await Bill.bulkCreate(billsToCreate, { transaction: t });
  return true;
 } catch (error) {
  throw new Error(`Gagal membuat tagihan awal untuk anggota: ${error.message}`);
 }
};