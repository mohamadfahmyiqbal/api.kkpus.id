import db from "../../../models/index.js";
import { createInitialBills } from "../../billing/createInitialBills.js";
import { processMidtransDisbursement } from "../../savings/disburseWithdrawal.js";
import { sendToUser } from "../../../controllers/utility/socket.js";
import { sendGlobalNotification } from "../../utility/notificationHelper.js";
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
      
      console.log(`[performFinalAction] Creating bills for financing ${entity.financing_id}, member ${memberId}, isArisan: ${isArisan}`);
      
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
            cicilan_target: entity.monthly_installment
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
      
      if (downPayment > 0) {
        await BillItem.create({
          bill_type_id: 7,
          category_code: downPaymentBillType?.type_code || 'TRANSACTION_DOWN_PAYMENT',
          bill_id: null,
          member_id: memberId,
          description: isArisan ? 'Uang Pangkal/DP Arisan' : 'Down Payment for Financing',
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
          description: isArisan ? `Setoran Arisan - Bulan ${i}` : `Financing Installment - Month ${i}`,
          amount: monthlyInstallment,
          due_date: dueDate,
          status: 'UNPAID'
        }, { transaction: t });
        billsCreated++;
      }
      
      console.log(`[performFinalAction] Total bills created: ${billsCreated}`);
      
      // Real-time notification + Global notification
      t.afterCommit(() => {
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
      });
      break;

    case "savings_withdrawal":
      console.log("[performFinalAction] savings_withdrawal entity:", {
        withdrawal_id: entity.withdrawal_id,
        savings_account_id: entity.savings_account_id,
        member_id: entity.member_id,
        amount: entity.amount,
        status: entity.status
      });
      
      // 1. Kurangi saldo di member_savings_accounts
      const account = await MemberSavingsAccount.findOne({
        where: { savings_account_id: entity.savings_account_id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      console.log("[performFinalAction] MemberSavingsAccount found:", {
        found: !!account,
        savings_account_id: entity.savings_account_id,
        current_balance: account?.current_balance,
        account_type: account?.account_type
      });
      if (account) {
        const newBalance = parseFloat(account.current_balance) - parseFloat(entity.amount);
        if (newBalance < 0) {
          throw new Error("Saldo tidak mencukupi untuk penarikan.");
        }
        const [updated] = await MemberSavingsAccount.update(
          { current_balance: newBalance },
          { where: { savings_account_id: entity.savings_account_id }, transaction: t }
        );
        console.log("[performFinalAction] MemberSavingsAccount updated:", {
          updated_rows: updated,
          new_balance: newBalance
        });
      }

      // 2. Kurangi saldo di tabel Account (ledger per kategori)
      // Cari account_type yang sesuai dengan produk (SS_SUKARELA, SW_POKOK, dll)
      const accountTypeMap = {
        "Simpanan Sukarela": "SS_SUKARELA",
        "Simpanan Pokok": "SW_POKOK",
        "Simpanan Wajib": "SW_WAJIB"
      };
      const targetAccountType = accountTypeMap[account?.account_type] || account?.account_type;
      
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

      t.afterCommit(async () => {
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
      
      const catalog = await db.SavingTarget.findOne({ 
        where: { saving_target_id: entity.saving_target_id }, 
        transaction: t 
      });
      
      const monthsTabungan = catalog?.term_months || 0;
      const minDeposit = parseFloat(catalog?.min_monthly_deposit) || 0;
      
      let billsCreatedTabungan = 0;
      for (let i = 1; i <= monthsTabungan; i++) {
        const dueDate = moment().add(i, "months").endOf("month").toDate();
        await BillItem.create({
          bill_type_id: tabunganBillType.bill_type_id,
          category_code: `TAB_DEP_${entity.member_saving_target_id}`,
          bill_id: null,
          member_id: targetMemberIdForTabungan,
          description: `Setoran ${catalog?.target_name || 'Tabungan'} - Bulan ${i}`,
          amount: minDeposit,
          due_date: dueDate,
          status: 'UNPAID'
        }, { transaction: t });
        billsCreatedTabungan++;
      }
      
      console.log(`[performFinalAction] Created ${billsCreatedTabungan} bills for Tabungan ${entity.member_saving_target_id}`);
      
      t.afterCommit(() => {
        sendToUser(targetMemberIdForTabungan, "bills:update", { trigger: true });
        
        sendGlobalNotification({
          memberId: targetMemberIdForTabungan,
          title: "Pengajuan Tabungan Disetujui!",
          content: `Pengajuan ${catalog?.target_name || 'Tabungan'} Anda telah disetujui. ${billsCreatedTabungan} tagihan telah dibuat.`,
          type: "APPROVAL",
          url: "/",
        }).catch((err) => console.error("[performFinalAction] Tabungan notification failed:", err.message));
      });
      break;

    default:
      console.log(`⚠️ Info: No action for entity: ${entityRef}`);
  }
};