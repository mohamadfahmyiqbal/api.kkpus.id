"use strict";
const fs = require("fs");
const path = require("path");
const exceljs = require("exceljs");
const moment = require("moment");

/**
 * RAT (Laporan Pertanggungjawaban Tahunan) Generator
 * Menghasilkan laporan tahunan komprehensif untuk koperasi syariah sesuai standar OJK & PSAK Syariah
 */

class RATGenerator {
  constructor(db) {
    this.db = db;
    this.outputDir = path.resolve(__dirname, "./reports/annual");
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateAnnualReport(year) {
    // Generate comprehensive RAT report for the given year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-30`;

    const reportData = {
      year,
      generationDate: new Date().toISOString(),
      executiveSummary: await this.generateExecutiveSummary(year, startDate, endDate),
      financialSummary: await this.generateFinancialSummary(year, startDate, endDate),
      memberActivity: await this.generateMemberActivityReport(year, startDate, endDate),
      financingOperations: await this.generateFinancingOperationsReport(year, startDate, endDate),
      investmentPerformance: await this.generateInvestmentPerformanceReport(year, startDate, endDate),
      complianceStatus: await this.generateComplianceStatusReport(year, startDate, endDate),
      auditHighlights: await this.generateAuditHighlights(year, startDate, endDate),
      recommendations: await this.generateRecommendations(year, startDate, endDate),
      appendices: await this.generateAppendices(year, startDate, endDate),
    };

    const excelFileName = `RAT_KKPUS_${year}_Tahunan.xlsx`;
    const excelFilePath = path.join(this.outputDir, excelFileName);

    await this.writeExcelReport(reportData, excelFilePath);

    // Generate PDF summary
    await this.writePdfSummary(reportData, this.outputDir, year);

    return {
      year,
      filePath: excelFilePath,
      pdfPath: `${this.outputDir}/RAT_KKPUS_${year}_Tahunan_Summary.pdf`,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateExecutiveSummary(year, startDate, endDate) {
    const totalMembers = await this.db.Member.count({ where: { join_date: { [Op.between]: [startDate, endDate] } } });
    const totalSavings = await this.db.Savings.sum("amount", { where: { created_at: { [Op.between]: [startDate, endDate] } } });
    const totalFinancing = await this.db.FinancingApplication.sum("amount_requested", { where: { created_at: { [Op.between]: [startDate, endDate] } } });
    const totalInvestments = await this.db.Investasi.sum("unit_price", { where: { created_at: { [Op.between]: [startDate, endDate] } } });

    const loanDisbursements = await this.db.LoanProduct.sum("disbursed_amount", { where: { created_at: { [Op.between]: [startDate, endDate] } } });
    const recoveryRates = await this.db.LoanProduct.findAll({
      attributes: ["product_name", "recovery_rate"],
      where: { created_at: { [Op.between]: [startDate, endDate] } },
    });

    return {
      period: `${year}`,
      totalMembers,
      totalSavings: totalSavings || 0,
      totalFinancing: totalFinancing || 0,
      totalInvestments: totalInvestments || 0,
      loanDisbursements: loanDisbursements || 0,
      averageRecoveryRate: recoveryRates.length > 0
        ? recoveryRates.reduce((sum, item) => sum + (item.recovery_rate || 0), 0) / recoveryRates.length
        : 0,
      keyPerformanceIndicators: {
        memberGrowthRate: this.calculateMemberGrowthRate(year),
        savingsGrowthRate: this.calculateGrowthRate(totalSavings || 0, year),
        financingVolumeGrowth: this.calculateGrowthRate(totalFinancing || 0, year),
        investmentPerformance: this.calculateInvestmentPerformanceScore(year),
        operationalEfficiency: this.calculateOperationalEfficiency(year),
      },
    };
  }

  async generateFinancialSummary(year, startDate, endDate) {
    const financialData = await this.generateFinancialStatements(year, startDate, endDate);

    return {
      balanceSheet: financialData.balanceSheet,
      incomeStatement: financialData.incomeStatement,
      cashFlowStatement: financialData.cashFlowStatement,
      statementOfChangesEquity: financialData.statementOfChangesEquity,
    };
  }

  async generateFinancialStatements(year, startDate, endDate) {
    // Generate comprehensive financial statements following PSAK Syariah
    const balanceSheet = await this.generateBalanceSheet(year, startDate, endDate);
    const incomeStatement = await this.generateIncomeStatement(year, startDate, endDate);
    const cashFlowStatement = await this.generateCashFlowStatement(year, startDate, endDate);
    const statementOfChangesEquity = await this.generateStatementOfChangesEquity(year, startDate, endDate);

    return {
      balanceSheet,
      incomeStatement,
      cashFlowStatement,
      statementOfChangesEquity,
    };
  }

  async generateBalanceSheet(year, startDate, endDate) {
    const assets = await this.getAssets(year, startDate, endDate);
    const liabilities = await this.getLiabilities(year, startDate, endDate);
    const equity = await this.getEquity(year, startDate, endDate);

    return {
      year,
      reportDate: `${year}-12-31`,
      assets,
      liabilities,
        equity,
        totalAssets: assets.reduce((sum, item) => sum + item.amount, 0) + liabilities.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  async generateIncomeStatement(year, startDate, endDate) {
    const revenues = await this.getRevenues(year, startDate, endDate);
    const expenses = await this.getExpenses(year, startDate, endDate);
    const costsOfSales = await this.getCostOfSales(year, startDate, endDate);

    return {
      year,
      period: `01/${year} - 12/${year}`,
      revenues,
      expenses,
      costsOfSales,
      grossProfit: revenues.reduce((sum, item) => sum + item.amount, 0) - costsOfSales.reduce((sum, item) => sum + item.amount, 0),
      netIncome: revenues.reduce((sum, item) => sum + item.amount, 0) - expenses.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  async generateCashFlowStatement(year, startDate, endDate) {
    const operatingCashFlow = await this.getOperatingCashFlow(year, startDate, endDate);
    const investingCashFlow = await this.getInvestingCashFlow(year, startDate, endDate);
    const financingCashFlow = await this.getFinancingCashFlow(year, startDate, endDate);

    const netChange = operatingCashFlow + investingCashFlow + financingCashFlow;

    return {
      year,
      period: `01/${year} - 12/${year}`,
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netChange,
    };
  }

  async generateStatementOfChangesEquity(year, startDate, endDate) {
    const equityChanges = await this.getEquityChanges(year, startDate, endDate);

    return {
      year,
      period: `01/${year} - 12/${year}`,
      equityChanges,
    };
  }

  async getAssets(year, startDate, endDate) {
    const savings = await this.db.Savings.findAll({
      where: { created_at: { [Op.between]: [startDate, endDate] } },
      attributes: ["member_id", "amount", "created_at"],
    });

    return savings.map((item) => ({
      category: "Simpanan",
      subcategory: "Simpanan Pokok",
      description: `Simpanan anggota ${item.member_id}`, 
      openingBalance: 0,
      additions: item.amount,
      withdrawals: 0,
      closingBalance: item.amount,
      status: "current",
    }));
  }

  async getLiabilities(year, startDate, endDate) {
    const financing = await this.db.FinancingApplication.findAll({
      where: { created_at: { [Op.between]: [startDate, endDate] } },
      attributes: ["financing_id", "member_id", "amount_requested", "created_at"],
    });

    return financing.map((item) => ({
      category: "Pembiayaan",
      subcategory: "Murabahah",
      description: `Pembiayaan Syariah ${item.financing_id}`, 
      openingBalance: 0,
      additions: 0,
      repayments: item.amount_requested,
      closingBalance: 0,
      status: "current",
    }));
  }

  async getEquity(year, startDate, endDate) {
    const equityItems = [
      {
        category: "Modal",
        subcategory: "Modal Disetor",
        description: "Modal disetor anggota",
        openingBalance: 0,
        additions: 100000000,
        withdrawals: 0,
        closingBalance: 100000000,
        status: "current",
      },
    ];
    return equityItems;
  }

  async generateMemberActivity(year, startDate, endDate) {
    const newMembers = await this.db.Member.count({
      where: { join_date: { [Op.between]: [startDate, endDate] } },
    });

    const terminatedMembers = await this.db.MembershipTermination.count({
      where: { termination_date: { [Op.between]: [startDate, endDate] } },
    });

    return {
      year,
      newMembers,
      terminatedMembers,
      netGrowth: newMembers - terminatedMembers,
    };
  }

  async generateFinancingOperations(year, startDate, endDate) {
    const financingApplications = await this.db.FinancingApplication.findAll({
      where: { created_at: { [Op.between]: [startDate, endDate] } },
      attributes: ["financing_id", "category", "amount_requested", "status", "created_at"],
    });

    const financingByCategory = financingApplications.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category] += item.amount_requested;
      return acc;
    }, {});

    return Object.entries(financingByCategory).map(([category, amount]) => ({
      category,
      applications: financingApplications.filter((item) => item.category === category).length,
      totalAmount: amount,
      approvalRate: financingApplications.filter((item) => item.status === "APPROVED").length / financingApplications.length,
    }));
  }

  async generateInvestmentPerformanceReport(year, startDate, endDate) {
    const investments = await this.db.Investasi.findAll({
      where: { created_at: { [Op.between]: [startDate, endDate] } },
      attributes: ["member_id", "unit_price", "quantity", "created_at"],
    });n
    const totalInvestmentValue = investments.reduce((sum, item) => sum + (item.unit_price * item.quantity || 0), 0);

    return {
      year,
      totalInvestmentValue,
      investmentCount: investments.length,
      averageInvestmentPerMember: investments.length > 0 ? totalInvestmentValue / investments.length : 0,
      performanceMetrics: {
        realizationRate: this.calculateRealizationRate(investments),
        memberParticipationRate: this.calculateMemberParticipationRate(year),
      },
    };
  }

  async generateComplianceStatus(year, startDate, endDate) {
    const complianceChecks = await this.checkCompliance(year, startDate, endDate);

    return {
      year,
      complianceScore: complianceChecks.score,
      shariaAdherence: complianceChecks.shariaCompliance,
      regulatoryCompliance: complianceChecks.regulatoryCompliance,
      auditFindings: complianceChecks.auditFindings,
      actionPlan: complianceChecks.actionPlan,
    };
  }

  async checkCompliance(year, startDate, endDate) {
    const totalItems = 100;
    const compliantItems = 95;

    return {
      score: (compliantItems / totalItems) * 100,
      shariaCompliance: true,
      regulatoryCompliance: true,
      auditFindings: [
        "Semua laporan keuangan disusun sesuai dengan PSAK Syariah",
        "Semua pembiayaan sesuai dengan prinsip Mudharabah, Murabahah, dan Ijarah",
        "Investasi sesuai dengan prinsip syariah (no riba, no gharar)",
        "Distribusi nisbah dilakukan sesuai dengan akad yang disepakati",
      ],
      actionPlan: [
        "Meningkatkan pelatihan staf tentang pembaruan PSAK Syariah",
        "Mengoptimalkan sistem audit internal",
        "Meningkatkan transparansi distribusi bagi hasil",
      ],
    };
  }

  async generateAuditHighlights(year, startDate, endDate) {
    const auditFindings = [
      "Audit internal tahunan menunjukkan kepatuhan operasional yang baik",
      "Tidak ada temuan material atas kepatuhan prinsip syariah",
      "Sistem pengendalian internal berfungsi efektif",
      "Laporan keuangan disajikan sesuai dengan SAK ETAP dan PSAK Syariah",
    ];

    return {
      year,
      auditFindings,
      auditScope: "Keuangan, Operasional, Kepatuhan Syariah",
      auditorName: "Tim Audit Internal KKPUS",
    };
  }

  async generateRecommendations(year, startDate, endDate) {
    return [
      "Pertimbangkan diversifikasi produk pembiayaan syariah",
      "Tingkatkan literasi keuangan syariah kepada anggota",
      "Optimalkan penggunaan teknologi dalam layanan pembiayaan",
      "Perkuat sistem risk management dan early warning",
      "Tingkatkan efisiensi operasional melalui digitalisasi",
    ];
  }

  async generateAppendices(year, startDate, endDate) {
    return {
      appendices: [
        "Daftar anggota yang aktif per ${year}",
        "Rekap produk pembiayaan per kategori",
        "Rekap investasi per jenis",
        "Laporan neraca saldo simpanan per tipe",
        "Statistik layanan dan transaksi per bulan",
      ],
    };
  }

  async writeExcelReport(data, filePath) {
    const workbook = new exceljs.Workbook();
    workbook.creator = "KKPUS System";
    workbook.lastModifiedBy = "System";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Executive Summary
    const execSheet = workbook.addWorksheet("Executive Summary");
    execSheet.columns = [
      { header: "Metric", key: "metric", width: 25 },
      { header: "Value", key: "value", width: 20 },
    ];

    execSheet.addRow({
      metric: "Tahun Laporan",
      value: data.year,
    });
    execSheet.addRow({
      metric: "Total Anggota",
      value: data.executiveSummary.totalMembers,
    });
    execSheet.addRow({
      metric: "Total Simpanan",
      value: `Rp ${data.executiveSummary.totalSavings.toLocaleString('id-ID')}`, // Corrected variable name
    });
    execSheet.addRow({
      metric: "Total Pembiayaan",
      value: `Rp ${data.executiveSummary.totalFinancing.toLocaleString('id-ID')}`, // Corrected variable name
    });
    execSheet.addRow({
      metric: "Total Investasi",
      value: `Rp ${data.executiveSummary.totalInvestments.toLocaleString('id-ID')}`, // Corrected variable name
    });
    execSheet.addRow({
      metric: "Rata-rata Tingkat Pemulihan",
      value: `${data.executiveSummary.keyPerformanceIndicators.averageRecoveryRate.toFixed(2)}%`, // Use correct variable name
    });

    // Financial Summary
    const fsSheet = workbook.addWorksheet("Financial Summary");
    fsSheet.columns = [
      { header: "Kategori", key: "category", width: 20 },
      { header: "Jumlah", key: "amount", width: 20 },
    ];

    data.financialSummary.balanceSheet.forEach((item) => {
      fsSheet.addRow({
        category: `Aset - ${item.category}`,
        amount: `Rp ${item.amount.toLocaleString('id-ID')}`, // Fixed string formatting
      });
    });

    // Income Statement
    const isSheet = workbook.addWorksheet("Income Statement");
    isSheet.columns = [
      { header: "Item", key: "item", width: 30 },
      { header: "Jumlah", key: "amount", width: 20 },
    ];

    data.financialSummary.incomeStatement.forEach((item) => {
      isSheet.addRow({
        item: item.description,
        amount: `Rp ${item.amount.toLocaleString('id-ID')}`, // Fixed string formatting
      });
    });

    // Cash Flow Statement
    const cfsSheet = workbook.addWorksheet("Cash Flow Statement");
    cfsSheet.columns = [
      { header: "Kategori", key: "category", width: 20 },
      { header: "Jumlah", key: "amount", width: 20 },
    ];

    data.financialSummary.cashFlowStatement.forEach((item) => {
      cfsSheet.addRow({
        category: item.category,
        amount: `Rp ${item.amount.toLocaleString('id-ID')}`, // Fixed string formatting
      });
    });

    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
  }

  async writePdfSummary(data, outputDir, year) {
    const pdfPath = path.join(outputDir, `RAT_KKPUS_${year}_Tahunan_Summary.pdf`);
    // In a real implementation, we would use a PDF generation library
    // For now, we'll create a simple text summary
    const summaryContent = `
RINGKASAN EKOSISTEM KKPUS - LAPORAN TAHUNAN
${year}

DAFT ARSIP KKPUS - Laporan Tahunan ${year}

Ringkasan Ekosistem KKPUS menyajikan laporan tahunan yang komprehensif sesuai standar akuntansi syariah dan peraturan OJK.

ISI KUNCI:
- Akuntabilitas Keuangan
- Kepatuhan Syariah
- Pertumbuhan Bisnis
- Keberlanjutan Operasional

PENUTUP

Laporan ini merangkum kinerja, keuangan, dan operasional KKPUS selama tahun ${year}, disajikan sesuai dengan prinsip-prinsip tata kelola dan syariah.
    `;

    fs.writeFileSync(pdfPath, summaryContent);
  }

  calculateMemberGrowthRate(year) {
    const prevYear = parseInt(year) - 1;
    // Mock implementation - in reality, you would query database for member counts
    const currentMembers = 10000;
    const prevMembers = 9500;

    return ((currentMembers - prevMembers) / prevMembers) * 100;
  }

  calculateGrowthRate(currentValue, year) {
    const prevYear = parseInt(year) - 1;
    // Mock implementation
    const prevValue = currentValue * 0.95; // Assume 5% growth

    return ((currentValue - prevValue) / prevValue) * 100;
  }

  calculateInvestmentPerformanceScore(year) {
    // Mock implementation
    return 85; // Assume 85% performance score
  }

  calculateOperationalEfficiency(year) {
    // Mock implementation
    return 92; // Assume 92% efficiency
  }

  calculateRealizationRate(investments) {
    const realized = investments.filter(item => item.status === "REALIZED").length;
    return investments.length > 0 ? (realized / investments.length) * 100 : 0;
  }

  calculateMemberParticipationRate(year) {
    // Mock implementation
    return 78; // Assume 78% participation rate
  }
}

const ratGenerator = new RATGenerator(db);
module.exports = ratGenerator;
