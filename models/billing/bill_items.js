// 📁 src/models/billing/bill_items.js
import { Sequelize } from "sequelize";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const BillItem = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BillItemModel = sequelize.define(
    "bill_items",
    {
      bill_item_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bill_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      bill_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      category_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('UNPAID', 'PAID', 'CANCELLED', 'OVERDUE'),
        defaultValue: 'UNPAID',
        allowNull: false,
      },
      financing_application_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      underscored: true, // WAJIB: Mengubah createdAt -> created_at & updatedAt -> updated_at
    }
  );

  BillItemModel.addHook('afterSave', async (instance, options) => {
    console.log(`[HOOK] afterSave BillItem ${instance.bill_item_id} (Category: ${instance.category_code}, Status: ${instance.status})`);
    const jualBeliCategories = ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'];
    setImmediate(async () => {
      if (jualBeliCategories.includes(instance.category_code)) {
        await syncJualBeliReport(sequelize, instance.member_id);
      }
      await syncFinancialSummary(sequelize, instance.member_id);
    });
  });

  BillItemModel.addHook('afterDestroy', async (instance, options) => {
    console.log(`[HOOK] afterDestroy BillItem ${instance.bill_item_id}`);
    const jualBeliCategories = ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'];
    setImmediate(async () => {
      if (jualBeliCategories.includes(instance.category_code)) {
        await syncJualBeliReport(sequelize, instance.member_id);
      }
      await syncFinancialSummary(sequelize, instance.member_id);
    });
  });

  return BillItemModel;
};

export default BillItem;