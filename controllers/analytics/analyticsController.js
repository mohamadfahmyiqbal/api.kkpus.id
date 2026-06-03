import db from "../../models/index.js";
import { Op } from "sequelize";

const { 
  Member, 
  Billing, 
  FinancingApplication, 
  Accounts,
  BillItems,
  ActivityLogs
} = db;

/**
 * Get comprehensive analytics data for dashboard
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Member Statistics
    const [
      totalMembers,
      newMembersThisMonth,
      activeMembers,
      inactiveMembers
    ] = await Promise.all([
      Member.count(),
      Member.count({
        where: { 
          created_at: { [Op.gte]: startOfMonth }
        }
      }),
      Member.count({
        where: { status_id: 1 } // Active status
      }),
      Member.count({
        where: { status_id: 2 } // Inactive status
      })
    ]);

    // 2. Financial Overview
    const [
      totalSavings,
      totalLoans,
      monthlyRevenue,
      monthlyExpenses
    ] = await Promise.all([
      Accounts.sum('current_balance', {
        where: { account_type: 'SIMPANAN' }
      }) || 0,
      Accounts.sum('current_balance', {
        where: { account_type: 'PINJAMAN' }
      }) || 0,
      BillItems.sum('amount', {
        where: {
          bill_type: 'SETORAN',
          due_date: { [Op.gte]: startOfMonth }
        }
      }) || 0,
      BillItems.sum('amount', {
        where: {
          bill_type: 'PENARIKAN',
          due_date: { [Op.gte]: startOfMonth }
        }
      }) || 0
    ]);

    // 3. Transaction Analytics
    const [
      totalTransactionsThisMonth,
      pendingTransactions,
      completedTransactions
    ] = await Promise.all([
      BillItems.count({
        where: {
          due_date: { [Op.gte]: startOfMonth }
        }
      }),
      BillItems.count({
        where: { 
          status: 'PENDING',
          due_date: { [Op.gte]: startOfMonth }
        }
      }),
      BillItems.count({
        where: { 
          status: 'PAID',
          due_date: { [Op.gte]: startOfMonth }
        }
      })
    ]);

    // 4. Loan Applications
    const [
      newLoanApplications,
      approvedLoans,
      rejectedLoans,
      pendingLoans
    ] = await Promise.all([
      FinancingApplication.count({
        where: { 
          created_at: { [Op.gte]: startOfMonth }
        }
      }),
      FinancingApplication.count({
        where: { 
          status: 'APPROVED',
          created_at: { [Op.gte]: startOfMonth }
        }
      }),
      FinancingApplication.count({
        where: { 
          status: 'REJECTED',
          created_at: { [Op.gte]: startOfMonth }
        }
      }),
      FinancingApplication.count({
        where: { 
          status: 'PENDING'
        }
      })
    ]);

    // 5. Monthly Growth Comparison
    const [
      lastMonthMembers,
      lastMonthRevenue,
      lastMonthTransactions
    ] = await Promise.all([
      Member.count({
        where: { 
          created_at: { 
            [Op.between]: [startOfLastMonth, endOfLastMonth] 
          }
        }
      }),
      BillItems.sum('amount', {
        where: {
          bill_type: 'SETORAN',
          due_date: { 
            [Op.between]: [startOfLastMonth, endOfLastMonth] 
          }
        }
      }) || 0,
      BillItems.count({
        where: {
          due_date: { 
            [Op.between]: [startOfLastMonth, endOfLastMonth] 
          }
        }
      })
    ]);

    // Calculate growth percentages
    const memberGrowth = lastMonthMembers > 0 
      ? ((newMembersThisMonth - lastMonthMembers) / lastMonthMembers * 100).toFixed(2)
      : 0;
    
    const revenueGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)
      : 0;

    const transactionGrowth = lastMonthTransactions > 0
      ? ((totalTransactionsThisMonth - lastMonthTransactions) / lastMonthTransactions * 100).toFixed(2)
      : 0;

    // 6. Recent Activities
    const recentActivities = await ActivityLogs.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [{
        model: Member,
        attributes: ['full_name', 'member_no']
      }]
    });

    // 7. Top Performers (Members with highest savings)
    const topSavers = await Member.findAll({
      limit: 5,
      order: [[{ model: Accounts, as: 'accounts' }, 'current_balance', 'DESC']],
      include: [{
        model: Accounts,
        where: { account_type: 'SIMPANAN' },
        attributes: ['current_balance']
      }],
      attributes: ['member_id', 'full_name', 'member_no']
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalMembers,
          newMembersThisMonth,
          activeMembers,
          inactiveMembers,
          totalSavings,
          totalLoans,
          monthlyRevenue,
          monthlyExpenses
        },
        transactions: {
          totalTransactionsThisMonth,
          pendingTransactions,
          completedTransactions
        },
        loans: {
          newLoanApplications,
          approvedLoans,
          rejectedLoans,
          pendingLoans
        },
        growth: {
          memberGrowth: parseFloat(memberGrowth),
          revenueGrowth: parseFloat(revenueGrowth),
          transactionGrowth: parseFloat(transactionGrowth)
        },
        recentActivities,
        topSavers
      }
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data analytics'
    });
  }
};

/**
 * Get transaction trends over time
 */
export const getTransactionTrends = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let dateFormat, startDate;

    switch (period) {
      case 'daily':
        dateFormat = '%Y-%m-%d';
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'weekly':
        dateFormat = '%Y-%u';
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'monthly':
      default:
        dateFormat = '%Y-%m';
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const trends = await BillItems.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat), 'period'],
        [db.sequelize.fn('COUNT', db.sequelize.col('bill_item_id')), 'count'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN bill_type = "SETORAN" THEN amount ELSE 0 END')), 'deposits'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN bill_type = "PENARIKAN" THEN amount ELSE 0 END')), 'withdrawals']
      ],
      where: {
        due_date: { [Op.gte]: startDate }
      },
      group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat)],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Transaction Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tren transaksi'
    });
  }
};
