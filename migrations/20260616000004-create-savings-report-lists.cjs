'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings_report_lists', {
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'members',
          key: 'member_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tahun_ini_pokok: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_ini_wajib: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_ini_sukarela: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_ini_total: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu_pokok: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu_wajib: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu_sukarela: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu_total: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu2_pokok: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu2_wajib: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu2_sukarela: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tahun_lalu2_total: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('savings_report_lists');
  }
};
