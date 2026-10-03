// controllers/program/getProgramPinjaman.js

import db from "../../models/index.js";

const {
  MemberLoan,
  Member,
  LoanProduct,
  FinancingApplication,
  BillItem,
} = db;

const getProgramPinjaman = async (req, res) => {
  try {
    const memberId = req.userId;
    console.log("[getProgramPinjaman] memberId:", memberId);

    // 1. Cek financing_applications dulu (pengajuan baru/pending)
    console.log("[getProgramPinjaman] Checking financing_applications for member_id:", memberId);
    
    // Test tanpa include dulu
    const financingAppRaw = await FinancingApplication.findOne({
      where: { member_id: memberId },
      order: [["created_at", "DESC"]],
    });
    console.log("[getProgramPinjaman] Raw financingApp:", financingAppRaw ? {
      id: financingAppRaw.financing_id,
      status: financingAppRaw.status,
      member_id: financingAppRaw.member_id,
      item_name: financingAppRaw.item_name
    } : "null");
    
    // Get valid loan product names to distinguish from general financing
    const loanProducts = await LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name);

    const financingApp = await FinancingApplication.findOne({
      where: { 
        member_id: memberId,
        category: {
          [db.Sequelize.Op.in]: loanProductNames
        }
      },
      include: [
        {
          model: Member,
          as: "member",
          required: false, // LEFT JOIN agar tetap return data meskipun member tidak ketemu
        },
      ],
      order: [["created_at", "DESC"]],
    });

    console.log("[getProgramPinjaman] financingApp found:", financingApp ? {
      id: financingApp.financing_id,
      status: financingApp.status,
      member_id: financingApp.member_id
    } : "null");

    // 2. Cek member_loans (pinjaman aktif atau lunas) terlebih dahulu
    // 2. Cek member_loans (pinjaman aktif atau lunas) terlebih dahulu
    console.log("[getProgramPinjaman] Checking member_loans...");
    const loan = await MemberLoan.findOne({
      where: { member_id: memberId },
      include: [
        { model: Member, as: "member" },
        { model: LoanProduct, as: "product" },
      ],
      order: [["created_at", "DESC"]],
    });

    let isAppCompleted = financingApp && (financingApp.status === "COMPLETED" || financingApp.status === "PAID_OFF" || financingApp.status === "PAID");
    
    if (!isAppCompleted && financingApp && financingApp.financing_id) {
        const unpaidCount = await BillItem.count({
            where: {
                financing_application_id: financingApp.financing_id,
                status: { [db.Sequelize.Op.in]: ['UNPAID', 'OVERDUE'] }
            }
        });
        const paidCount = await BillItem.count({
            where: {
                financing_application_id: financingApp.financing_id,
                status: 'PAID'
            }
        });
        if (paidCount > 0 && unpaidCount === 0) {
            isAppCompleted = true;
            console.log(`[getProgramPinjaman] Financing App ${financingApp.financing_id} is considered COMPLETED because all generated bills are PAID.`);
        }
    }

    if (!isAppCompleted && loan && loan.loan_id) {
        const unpaidCountLoan = await BillItem.count({
            where: {
                financing_application_id: loan.loan_id,
                status: { [db.Sequelize.Op.in]: ['UNPAID', 'OVERDUE'] }
            }
        });
        const paidCountLoan = await BillItem.count({
            where: {
                financing_application_id: loan.loan_id,
                status: 'PAID'
            }
        });
        // Pastikan loan benar-benar lunas jika ada bill terbayar dan tidak ada yang belum dibayar
        if (paidCountLoan > 0 && unpaidCountLoan === 0) {
            isAppCompleted = true;
            console.log(`[getProgramPinjaman] Loan ${loan.loan_id} is considered COMPLETED because all generated bills are PAID.`);
        }
    }

    if (loan) {
      console.log("[getProgramPinjaman] member_loans found, returning it");
      const data = {
        loan_id: loan.loan_id,
        loan_product_id: loan.loan_product_id,
        member_id: loan.member_id,
        nominal_principal: loan.nominal_principal,
        term_count: loan.term_count,
        installment_amount: loan.installment_amount,
        disbursement_method: loan.disbursement_method,
        disbursement_date: loan.disbursement_date,
        bank_name: loan.bank_name,
        bank_account_no: loan.bank_account_no,
        product_id: loan.product_id,
        member: loan.member,
        product: loan.product,
        created_at: loan.created_at,
        updated_at: loan.updated_at,
        principal_amount: loan.principal_amount,
        loan_amount: loan.loan_amount,
        monthly_payment: loan.monthly_payment,
        total_repayment: loan.total_repayment,
        interest_rate: loan.interest_rate,
        margin_amount: loan.margin_amount,
        tenor_months: loan.tenor_months,
        status: (loan.loan_amount > 0 && loan.total_repayment >= loan.loan_amount) || isAppCompleted
                ? "LUNAS" 
                : loan.status,
        is_pending: false,
        is_approved: true, // Since it's a loan, it's already approved
      };
      return res.json({ success: true, data });
    }

    // 3. Jika tidak ada loan yang terbentuk, cek apakah ada financing application yang pending/approved/lunas
    if (
      financingApp &&
      (financingApp.status === "PENDING" ||
        financingApp.status === "IN_PROGRESS" ||
        financingApp.status === "WAITING_APPROVAL" ||
        financingApp.status === "APPROVED" ||
        isAppCompleted ||
        financingApp.current_step_id != null)
    ) {
      console.log("[getProgramPinjaman] Returning financing application data");
      const isApproved = financingApp.status === "APPROVED" || isAppCompleted;
      const data = {
        loan_id: financingApp.financing_id,
        financing_id: financingApp.financing_id,
        member_id: financingApp.member_id,
        nominal_principal: financingApp.amount_requested,
        principal_amount: financingApp.amount_requested,
        loan_amount: financingApp.amount_requested,
        term_count: financingApp.cooperation_months || 12,
        tenor_months: financingApp.cooperation_months || 12,
        installment_amount: financingApp.monthly_installment,
        monthly_payment: financingApp.monthly_installment,
        disbursement_method: financingApp.metode_pencairan,
        bank_name: financingApp.bank_tujuan,
        bank_account_no: financingApp.no_rekening,
        status: isAppCompleted ? "LUNAS" : financingApp.status,
        current_step_id: financingApp.current_step_id,
        approval_flow_id: financingApp.approval_flow_id,
        akad_type: financingApp.akad_type || "Murabahah",
        is_pending: !isApproved, // false jika sudah approved
        is_approved: isApproved, // true jika sudah approved
        status_label: isAppCompleted ? "Lunas" : (isApproved ? "Aktif (Disetujui)" : "Menunggu Approval"),
        created_at: financingApp.created_at,
        updated_at: financingApp.updated_at,
        member: financingApp.member,
        product: {
          name: financingApp.item_name || financingApp.category || "Pinjaman Lunak",
          akad_type: financingApp.akad_type || "Murabahah",
          loan_product_id: null,
        },
      };

      console.log("[getProgramPinjaman] Returning financing data:", data);
      return res.json({ success: true, data });
    }

    console.log("[getProgramPinjaman] No pending financing and no loan data found, returning null");
    return res.json({ success: true, data: null });
  } catch (error) {
    console.error("[getProgramPinjaman] ERROR:", error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

export default getProgramPinjaman;
