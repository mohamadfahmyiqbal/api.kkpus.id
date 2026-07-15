'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jual_beli_reports', {
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
      total_margin: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      total_dp: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      total_cicilan: {
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

    await queryInterface.addConstraint('jual_beli_reports', {
      fields: ['member_id', 'year'],
      type: 'unique',
      name: 'unique_member_year_report'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jual_beli_reports');
  }
};
