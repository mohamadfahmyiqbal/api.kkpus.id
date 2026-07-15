import db from "../../../models/index.js";
import { createInitialBills } from "../../billing/createInitialBills.js";
import { processMidtransDisbursement } from "../../savings/disburseWithdrawal.js";
import { sendToUser } from "../../../utils/socket.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";
import { syncFinancialSummary } from "../../../services/financialSummarySyncService.js";
import { syncSavingsReportList } from "../../../services/savingsReportSyncService.js";
import { syncJualBeliReport } from "../../../services/jualBeliReportSyncService.js";
import moment from "moment";

export const performFinalAction = async ({ entityRef, entity, transaction: t, approverId }) => {
  console.log("[performFinalAction] CALLED with entityRef:", entityRef);
  const { ActivityLog, FinancingApplication, SavingsWithdrawal, BillItem, BillType, MemberSavingsAccount, Account } = db;

  switch (entityRef) {
    case "members": // Sinkron dengan EntityModels['members']
      const targetMemberId = entity.member_id;
      
      // Update status to APPROVED
      await db.MemberRegistration.update(
        { final_status: "APPROVED" },
        { where: { registration_id: entity.registration_id }, transaction: t }
      );

      // Sync data to Member table
      await db.Member.update({
        nik_ktp: entity.nik_ktp || null,
        address: entity.address_ktp || null,
        province_id: entity.province_id || null,
        city_id: entity.city_id || null,
        district_id: entity.district_id || null,
        subdistrict_id: entity.subdistrict_id || null,
        rt: entity.rt || null,
        rw: entity.rw || null,
        member_type: entity.member_type || 'Reguler',
        foto: entity.selfie_photo_path || null
      }, { where: { member_id: targetMemberId }, transaction: t });

      // 1. Generate Invoice (1 Pokok + 12 Wajib)
      await createInitialBills(targetMemberId, ["SW_POKOK", "SW_WAJIB"], t, 12);
      
      // 2. Log Aktivitas (Member belum aktif, menunggu pembayaran)
      await ActivityLog.create({
        member_id: approverId,
        activity_type: 'FINAL_APPROVAL',
        activity_datetime: new Date(),
        detail: `Persetujuan pendaftaran Member ID: ${targetMemberId}. Menunggu pembayaran untuk aktivasi.`
      }, { transaction: t });

      // 3. Real-time Notification Pasca Commit
      // Member akan diaktifkan saat pembayaran berhasil di midtransNotification.js
      t.afterCommit(() => {
        sendToUser(targetMemberId, "registration:status_update", {
          status: "APPROVED_WAITING_PAYMENT",
          message: "Pendaftaran Anda telah disetujui. Silahkan lakukan pembayaran tagihan untuk mengaktifkan keanggotaan."
        });
        sendToUser(targetMemberId, "bills:update", { trigger: true });
      });
      break;

    case "financing_applications":
      const memberId = entity.member_id;
      const isArisan = entity.category === "Arisan";
      const isPelunasan = typeof entity.category === 'string' && entity.category.toLowerCase().includes('pelunasan');
      
      console.log(`[performFinalAction] Creating bills for financing ${entity.financing_id}, member ${memberId}, isArisan: ${isArisan}, isPelunasan: ${isPelunasan}`);
      
      // Update status to APPROVED
      await FinancingApplication.update(
        { status: "APPROVED", updated_at: new Date() }, 
        { where: { financing_id: entity.financing_id }, transaction: t }
      );

      // KHUSUS ARISAN: Daftarkan sebagai partisipan arisan
      if (isArisan && entity.arisan_batch_id) {
        const { ArisanParticipant } = db;
        
        // Cek apakah sudah terdaftar (mencegah duplikasi jika terpanggil 2x)
        const existingParticipant = await ArisanParticipant.findOne({
          where: { 
            member_id: memberId,
            arisan_batch_id: entity.arisan_batch_id
          },
          transaction: t
        });

        if (!existingParticipant) {
          // Hitung nomor urut peserta
          const participantCount = await ArisanParticipant.count({
            where: { arisan_batch_id: entity.arisan_batch_id },
            transaction: t
          });

          await ArisanParticipant.create({
            arisan_batch_id: entity.arisan_batch_id,
            member_id: memberId,
            participant_no: participantCount + 1,
            saldo_putang: 0,
            cicilan_target: entity.monthly_installment,
            status: 'APPROVED'
          }, { transaction: t });
          
          console.log(`[performFinalAction] Created ArisanParticipant for member ${memberId} in batch ${entity.arisan_batch_id}`);
        }
      }
      
      // Get bill types for financing
      const downPaymentBillType = await BillType.findByPk(7, { transaction: t });
      const installmentBillType = await BillType.findByPk(8, { transaction: t });
      
      console.log(`[performFinalAction] Bill types:`, {
        downPaymentBillType: downPaymentBillType?.type_code,
        installmentBillType: installmentBillType?.type_code
      });
      
      // Create bill_items for downpayment and installments
      const downPayment = parseFloat(entity.down_payment) || 0;
      const monthlyInstallment = parseFloat(entity.monthly_installment) || 0;
      const months = entity.cooperation_months || 0;
      
      let billsCreated = 0;
      
      if (!isPelunasan) {
        if (downPayment > 0) {
          await BillItem.create({
            bill_type_id: 7,
            category_code: downPaymentBillType?.type_code || 'TRANSACTION_DOWN_PAYMENT',
            bill_id: null,
            member_id: memberId,
            financing_application_id: entity.financing_id,
            description: isArisan ? 'Uang Pangkal/DP Arisan' : `DP / Uang Muka ${entity.category || 'Pinjaman'}`,
            amount: downPayment,
            due_date: new Date(),
            status: 'UNPAID'
          }, { transaction: t });
          billsCreated++;
        }
        
        for (let i = 1; i <= months; i++) {
          const dueDate = moment().add(i, "months").endOf("month").toDate();
          await BillItem.create({
            bill_type_id: 8,
            category_code: installmentBillType?.type_code || 'TRANSACTION_INSTALLMENT',
            bill_id: null,
            member_id: memberId,
            financing_application_id: entity.financing_id,
            description: isArisan ? `Setoran Arisan - Bulan ${i}` : `Cicilan ${entity.category || 'Pinjaman Lunak'} - Bulan ${i}`,
            amount: monthlyInstallment,
            due_date: dueDate,
            status: 'UNPAID'
          }, { transaction: t });
          billsCreated++;
        }
      }
      
      console.log(`[performFinalAction] Total bills created: ${billsCreated}`);
      
      // Real-time notification + Global notification
      t.afterCommit(async () => {
        sendToUser(memberId, "bills:update", { trigger: true });
        
        const title = isArisan ? "Arisan Disetujui!" : "Pembiayaan Disetujui!";
        const content = isArisan 
          ? `Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.`
          : `Pembiayaan Anda telah disetujui. ${billsCreated} tagihan telah dibuat.`;

        sendGlobalNotification({
          memberId,
          title,
          content,
          type: "APPROVAL",
          url: isArisan ? "/program" : "/",
        }).catch((err) => console.error("[performFinalAction] Financing notification failed:", err.message));

        // Sync reports
        try {
          await syncJualBeliReport(db.sequelize, memberId);
          await syncFinancialSummary(db.sequelize, memberId);
        } catch (error) {
          console.error("[performFinalAction] Failed to sync reports after financing approval:", error.message);
        }
      });
      break;

    case "savings_withdrawal":
    case "tabungan_withdrawals":
      console.log("[performFinalAction] withdrawal entity:", {
        withdrawal_id: entity.withdrawal_id,
        savings_account_id: entity.savings_account_id,
        member_id: entity.member_id,
        amount: entity.amount,
        status: entity.status
      });
      
      // 1. Kurangi saldo di member_savings_accounts atau member_saving_targets
      let account = null;
      
      if (entity.savings_account_id) {
        account = await MemberSavingsAccount.findOne({
          where: { savings_account_id: entity.savings_account_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (account) {
          const newBalance = parseFloat(account.current_balance) - parseFloat(entity.amount);
          if (newBalance < 0) {
            throw new Error("Saldo tidak mencukupi untuk penarikan.");
          }
          await MemberSavingsAccount.update(
            { current_balance: newBalance },
            { where: { savings_account_id: entity.savings_account_id }, transaction: t }
          );
        }
      } else if (entity.member_saving_target_id) {
        const targetAccount = await db.MemberSavingTarget.findOne({
          where: { member_saving_target_id: entity.member_saving_target_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (targetAccount) {
          const newBalance = parseFloat(targetAccount.current_balance) - parseFloat(entity.amount);
          if (newBalance < 0) {
            throw new Error("Saldo tabungan tidak mencukupi untuk penarikan.");
          }
          
          const targetStatus = newBalance <= 0 ? "COMPLETED" : targetAccount.status;
          
          await db.MemberSavingTarget.update(
            { current_balance: newBalance, status: targetStatus },
            { where: { member_saving_target_id: entity.member_saving_target_id }, transaction: t }
          );
        }
      }

      // 2. Kurangi saldo di tabel Account (ledger per kategori)
      // Cari account_type yang sesuai dengan produk (SS_SUKARELA, SW_POKOK, dll)
      const accountTypeMap = {
        "Simpanan Sukarela": "SS_SUKARELA",
        "Simpanan Pokok": "SW_POKOK",
        "Simpanan Wajib": "SW_WAJIB"
      };
      const targetAccountType = account ? (accountTypeMap[account.account_type] || account.account_type) : null;
      
      if (targetAccountType) {
        const typeAccount = await Account.findOne({
          where: { member_id: entity.member_id, account_type: targetAccountType },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (typeAccount) {
          const newTypeBalance = parseFloat(typeAccount.current_balance) - parseFloat(entity.amount);
          await Account.update(
            { current_balance: newTypeBalance },
            { where: { account_id: typeAccount.account_id }, transaction: t }
          );
        }
      }

      // 3. Kurangi saldo total di Account (SAVINGS)
      const mainAccount = await Account.findOne({
        where: { member_id: entity.member_id, account_type: "SAVINGS" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (mainAccount) {
        const newMainBalance = parseFloat(mainAccount.current_balance) - parseFloat(entity.amount);
        await Account.update(
          { current_balance: newMainBalance },
          { where: { account_id: mainAccount.account_id }, transaction: t }
        );
      }

      // 4. Update status withdrawal
      await SavingsWithdrawal.update({
        status: "READY_TO_PAY",
        approved_at: new Date(),
        is_approved_bendahara: true
      }, { where: { withdrawal_id: entity.withdrawal_id }, transaction: t });

      // 5. Tambahkan record PENARIKAN ke tabel Transaction agar masuk ke perhitungan summary keuangan
      const txCategoryMap = {
        "Simpanan Sukarela": "SS_SUKARELA",
        "Simpanan Pokok": "SW_POKOK",
        "Simpanan Wajib": "SW_WAJIB"
      };
      await db.Transaction.create({
        member_id: entity.member_id,
        midtrans_order_id: `WD-${entity.withdrawal_id}-${Date.now()}`,
        tx_type: "PENARIKAN",
        tx_category: txCategoryMap[account?.account_type] || account?.account_type || "PENARIKAN_SIMPANAN",
        amount: entity.amount,
        status: "PAID",
        settlement_time: new Date()
      }, { transaction: t });

      t.afterCommit(async () => {
        try {
          await syncFinancialSummary(db.sequelize, entity.member_id);
          await syncSavingsReportList(db.sequelize);
        } catch (err) {
          console.error("[performFinalAction] syncFinancialSummary failed:", err.message);
        }

        try {
          await processMidtransDisbursement(entity.withdrawal_id);
        } catch (err) {
          console.error("[performFinalAction] Auto-disbursement failed:", err.message);
        }

        // Notify member that withdrawal was approved
        sendGlobalNotification({
          memberId: entity.member_id,
          title: "Penarikan Disetujui!",
          content: `Penarikan sebesar Rp ${(parseFloat(entity.amount) || 0).toLocaleString("id-ID")} telah disetujui dan sedang diproses.`,
          type: "APPROVAL",
          url: "/",
        }).catch((err) => console.error("[performFinalAction] Withdrawal notification failed:", err.message));
      });
      break;

    case "member_saving_targets":
      const targetMemberIdForTabungan = entity.member_id;
      
      // Update status to APPROVED
      await db.MemberSavingTarget.update(
        { status: "APPROVED", updated_at: new Date() }, 
        { where: { member_saving_target_id: entity.member_saving_target_id }, transaction: t }
      );
      
      const [tabunganBillType] = await BillType.findOrCreate({
        where: { type_code: 'TABUNGAN_DEPOSIT' },
        defaults: {
          tx_type: 'SETORAN',
          category_map: 'SAVINGS_TARGET',
          type_name: 'Setoran Tabungan',
          period_type: 'MONTHLY',
          default_amount: 0
        },
        transaction: t
      });
      
      console.log(`[performFinalAction] MemberSavingTarget ${entity.member_saving_target_id} approved. No monthly installment bills generated because saving targets are completely flexible.`);

      t.afterCommit(() => {
        sendToUser(targetMemberIdForTabungan, "savings:update", { trigger: true });
        sendToUser(targetMemberIdForTabungan, "bills:update", { trigger: true });
        
        sendGlobalNotification({
          memberId: targetMemberIdForTabungan,
          title: "Pengajuan Tabungan Disetujui!",
          content: `Pengajuan Tabungan Anda telah disetujui.`,
          type: "APPROVAL",
          url: "/",
        }).catch((err) => console.error("[performFinalAction] Tabungan notification failed:", err.message));
      });
      break;

    default:
      console.log(`⚠️ Info: No action for entity: ${entityRef}`);
  }
};