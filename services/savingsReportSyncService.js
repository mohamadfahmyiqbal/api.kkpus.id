import db from "../models/index.js";
import { Sequelize } from "sequelize";

/**
 * Synchronize Savings report list for all members.
 * This populates the savings_report_lists table which is used by the admin report page.
 */
export const syncSavingsReportList = async (sequelize, specificMemberId = null) => {
  const Member = db.Member;
  const MemberSavingsAccount = db.MemberSavingsAccount;
  const SavingsProduct = db.SavingsProduct;
  const SavingsReportList = db.SavingsReportList;
  const SavingsReport = db.SavingsReport;
  const Op = db.Sequelize.Op;

  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const twoYearsAgo = currentYear - 2;

    // 1. Fetch members
    const whereClause = specificMemberId ? { member_id: specificMemberId } : {};
    const members = await Member.findAll({
      where: whereClause,
      attributes: ["member_id", "full_name"],
    });

    for (const member of members) {
      // 2. Fetch savings data for this member
      // For now, we fetch current balances. 
      // In a real scenario, we might want to fetch historical balances from a ledger or historical table.
      // But based on the existing getAdminSavingsReport.js, it uses current_balance.
      
      const accounts = await MemberSavingsAccount.findAll({
        where: { member_id: member.member_id },
        include: [
          {
            model: SavingsProduct,
            as: "savingsProduct",
            attributes: ["name"]
          }
        ]
      });

      let ini_pokok = 0, ini_wajib = 0, ini_sukarela = 0, ini_total = 0;
      
      accounts.forEach(acc => {
        const type = (acc.savingsProduct?.name || '').toUpperCase();
        const balance = parseFloat(acc.current_balance) || 0;
        
        ini_total += balance;
        if (type.includes('POKOK')) ini_pokok += balance;
        else if (type.includes('WAJIB')) ini_wajib += balance;
        else ini_sukarela += balance;
      });

      // For historical data (lastYear and twoYearsAgo), we might need to query the SavingsReport table
      // or other historical sources. If those tables are empty, we default to 0.
      const historical = await SavingsReport.findAll({
        where: { 
          member_id: member.member_id,
          year: { [Op.in]: [lastYear, twoYearsAgo] }
        }
      });

      let lalu_pokok = 0, lalu_wajib = 0, lalu_sukarela = 0, lalu_total = 0;
      let lalu2_pokok = 0, lalu2_wajib = 0, lalu2_sukarela = 0, lalu2_total = 0;

      historical.forEach(h => {
        if (h.year === lastYear) {
          lalu_pokok = parseFloat(h.total_pokok) || 0;
          lalu_wajib = parseFloat(h.total_wajib) || 0;
          lalu_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu_total = parseFloat(h.total_all) || 0;
        } else if (h.year === twoYearsAgo) {
          lalu2_pokok = parseFloat(h.total_pokok) || 0;
          lalu2_wajib = parseFloat(h.total_wajib) || 0;
          lalu2_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu2_total = parseFloat(h.total_all) || 0;
        }
      });

      // 3. Upsert into savings_report_lists
      try {
        await SavingsReportList.upsert({
          member_id: member.member_id,
          nama: member.full_name,
          tahun_ini_pokok: ini_pokok,
          tahun_ini_wajib: ini_wajib,
          tahun_ini_sukarela: ini_sukarela,
          tahun_ini_total: ini_total,
          tahun_lalu_pokok: lalu_pokok,
          tahun_lalu_wajib: lalu_wajib,
          tahun_lalu_sukarela: lalu_sukarela,
          tahun_lalu_total: lalu_total,
          tahun_lalu2_pokok: lalu2_pokok,
          tahun_lalu2_wajib: lalu2_wajib,
          tahun_lalu2_sukarela: lalu2_sukarela,
          tahun_lalu2_total: lalu2_total
        });
      } catch (err) {
        console.error("UPSERT ERROR for member:", member.member_id, err);
      }
    }

    console.log(`Successfully synced savings report list for ${members.length} members`);
  } catch (error) {
    console.error(`Failed to sync savings report list:`, error.message);
  }
};
