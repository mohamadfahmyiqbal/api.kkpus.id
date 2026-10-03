import db from "../../../../models/index.js";
import { createInitialBills } from "../../../billing/createInitialBills.js";
import { sendToUser } from "../../../../utils/socket.js";

/**
 * Final action handler for Member registration approvals.
 */
export const handleMemberFinalAction = async ({ entity, transaction: t, approverId }) => {
  const { ActivityLog } = db;
  const targetMemberId = entity.member_id;

  // 1. Update registration status to APPROVED
  await db.MemberRegistration.update(
    { final_status: "APPROVED" },
    { where: { registration_id: entity.registration_id }, transaction: t }
  );

  // 2. Sync data to Member table
  await db.Member.update(
    {
      nik_ktp: entity.nik_ktp || null,
      address: entity.address_ktp || null,
      province_id: entity.province_id || null,
      city_id: entity.city_id || null,
      district_id: entity.district_id || null,
      subdistrict_id: entity.subdistrict_id || null,
      rt: entity.rt || null,
      rw: entity.rw || null,
      member_type: entity.member_type || "Reguler",
      foto: entity.selfie_photo_path || null,
    },
    { where: { member_id: targetMemberId }, transaction: t }
  );

  // 3. Generate Invoice (1 Pokok + 12 Wajib)
  await createInitialBills(targetMemberId, ["SW_POKOK", "SW_WAJIB"], t, 12);

  // 4. Log Aktivitas (Member belum aktif, menunggu pembayaran)
  await ActivityLog.create(
    {
      member_id: approverId,
      activity_type: "FINAL_APPROVAL",
      activity_datetime: new Date(),
      detail: `Persetujuan pendaftaran Member ID: ${targetMemberId}. Menunggu pembayaran untuk aktivasi.`,
    },
    { transaction: t }
  );

  // 5. Real-time Notification Pasca Commit
  t.afterCommit(() => {
    sendToUser(targetMemberId, "registration:status_update", {
      status: "APPROVED_WAITING_PAYMENT",
      message: "Pendaftaran Anda telah disetujui. Silahkan lakukan pembayaran tagihan untuk mengaktifkan keanggotaan.",
    });
    sendToUser(targetMemberId, "bills:update", { trigger: true });
  });
};
