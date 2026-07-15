'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings_journal_reports', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      account_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      debet: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      kredit: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('savings_journal_reports', {
      fields: ['period', 'account_code'],
      type: 'unique',
      name: 'unique_period_account_savings_journal'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('savings_journal_reports');
  }
};
