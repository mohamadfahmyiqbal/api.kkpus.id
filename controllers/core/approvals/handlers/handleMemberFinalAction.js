import db from "../../../../models/index.js";
import { processLedgerRecording } from "../../../../services/ledgerHelper.js";
import { syncFinancialSummary } from "../../../../services/financialSummarySyncService.js";
import { sendToUser } from "../../../../utils/socket.js";
import { sendGlobalNotification } from "../../../../services/notificationHelper.js";

/**
 * Final action handler for Member registration approvals (Step 3: Bendahara / Final Step).
 * Di tahap ini, bukti pembayaran manual telah diverifikasi oleh Bendahara:
 * 1. Pendaftaran final_status = APPROVED
 * 2. Transaksi setoran awal diupdate ke PAID & settlement_time diisi
 * 3. Tagihan (SW Pokok & Wajib bulan ke-1) diupdate ke PAID
 * 4. Anggota diaktifkan: status_id = Anggota Reguler / Luar Biasa, join_date = NOW(), is_registration_done = 1
 * 5. Pencatatan ke Buku Kas / Ledger
 */
export const handleMemberFinalAction = async ({ entity, transaction: t, approverId }) => {
  const { ActivityLog, Bill, BillItem, Transaction, Member, MemberRegistration, MemberStatus } = db;
  const targetMemberId = entity.member_id;

  // 1. Update status pendaftaran menjadi APPROVED
  await MemberRegistration.update(
    { final_status: "APPROVED" },
    { where: { registration_id: entity.registration_id }, transaction: t }
  );

  // 2. Sinkronkan data profil ke tabel members
  const membertypeFromReg = (entity.member_type || "").toLowerCase();
  let targetStatusName = "Anggota Reguler";
  if (membertypeFromReg.includes("luar biasa")) {
    targetStatusName = "Anggota Luar Biasa";
  }

  const activeStatus = await MemberStatus.findOne({
    where: { status_name: targetStatusName },
    transaction: t,
  });

  await Member.update(
    {
      nik_ktp: entity.nik_ktp || null,
      address: entity.address_ktp || null,
      province_id: entity.province_id || null,
      city_id: entity.city_id || null,
      district_id: entity.district_id || null,
      subdistrict_id: entity.subdistrict_id || null,
      rt: entity.rt || null,
      rw: entity.rw || null,
      member_type: targetStatusName,
      status_id: activeStatus ? activeStatus.status_id : undefined,
      join_date: new Date(),
      is_registration_done: 1,
      foto: entity.selfie_photo_path || null,
    },
    { where: { member_id: targetMemberId }, transaction: t }
  );

  // 3. Verifikasi & Selesaikan Transaksi Pembayaran Manual Setoran Pendaftaran
  const pendingTx = await Transaction.findOne({
    where: {
      member_id: targetMemberId,
      status: ["PENDING_VERIFICATION", "pending_verification"],
    },
    order: [["created_at", "DESC"]],
    transaction: t,
  });

  if (pendingTx) {
    await pendingTx.update(
      {
        status: "PAID",
        settlement_time: new Date(),
        verified_by: approverId || null,
        verified_at: new Date(),
      },
      { transaction: t }
    );

    // Update Bill & BillItems terkait transaksi pendaftaran
    if (pendingTx.bill_id) {
      await Bill.update(
        { status: "paid" },
        { where: { bill_id: pendingTx.bill_id }, transaction: t }
      );
      await BillItem.update(
        { status: "PAID" },
        { where: { bill_id: pendingTx.bill_id }, transaction: t }
      );
    }

    // Catat ke Buku Kas / Ledger
    await processLedgerRecording(pendingTx, t);
  }

  // 4. Catat Log Aktivitas
  await ActivityLog.create(
    {
      member_id: approverId,
      activity_type: "FINAL_APPROVAL",
      activity_datetime: new Date(),
      detail: `Pendaftaran Member ID: ${targetMemberId} telah disetujui penuh oleh Bendahara dan diaktifkan.`,
    },
    { transaction: t }
  );

  // 5. Real-time Notification & Socket Pasca Commit
  t.afterCommit(async () => {
    sendToUser(targetMemberId, "registration:status_update", {
      status: "APPROVED",
      final_status: "APPROVED",
      message: "Selamat! Pendaftaran dan setoran simpanan Anda telah disetujui oleh Bendahara. Keanggotaan Anda telah aktif.",
    });
    sendToUser(targetMemberId, "bills:update", { trigger: true });
    sendToUser(targetMemberId, "member_registration:update", {
      status: "APPROVED",
      final_status: "APPROVED",
      trigger: true,
    });

    try {
      await syncFinancialSummary(db.sequelize, targetMemberId);
    } catch (e) {
      console.error("[handleMemberFinalAction] syncFinancialSummary error:", e.message);
    }

    sendGlobalNotification({
      memberId: targetMemberId,
      title: "Keanggotaan Telah Aktif!",
      content: "Selamat! Pendaftaran Anda telah disetujui penuh oleh Bendahara. Akun keanggotaan Anda kini aktif.",
      type: "APPROVAL",
      url: "/dashboard",
    }).catch((e) => console.error("[handleMemberFinalAction] Global Notification error:", e.message));
  });
};
