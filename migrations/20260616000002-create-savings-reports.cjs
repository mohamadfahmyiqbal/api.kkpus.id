'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings_reports', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'members',
          key: 'member_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_pokok: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      total_wajib: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      total_sukarela: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      total_all: {
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

    await queryInterface.addConstraint('savings_reports', {
      fields: ['member_id', 'year'],
      type: 'unique',
      name: 'unique_member_year_savings_report'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('savings_reports');
  }
};
