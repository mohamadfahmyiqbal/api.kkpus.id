import db from "./models/index.js";
import { Op } from "sequelize";

async function test() {
  try {
    const finalTotalAnggota = await db.Member.count();
    console.log("Member count:", finalTotalAnggota);

    const totalSimpanan = await db.Account.sum('current_balance', {
      where: { 
        account_type: { [Op.in]: ['SAVINGS', 'SW_POKOK', 'SW_WAJIB', 'SS_SUKARELA'] } 
      }
    });
    console.log("totalSimpanan:", totalSimpanan);

    const pendingJualBeli = await db.GeneralTransaction.findAll({
      where: { status: 'PENDING' },
      include: [{ model: db.Member, as: 'member', attributes: ['full_name'] }],
      limit: 1,
    });
    console.log("pendingJualBeli OK");

    const pendingInvestasi = await db.SukukOrder.findAll({
      where: { status: 'PENDING' },
      include: [{ model: db.Member, as: 'member', attributes: ['full_name'] }, { model: db.SukukIssue, as: 'sukukIssue' }],
      limit: 1,
    });
    console.log("pendingInvestasi OK");

  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    process.exit(0);
  }
}

test();
