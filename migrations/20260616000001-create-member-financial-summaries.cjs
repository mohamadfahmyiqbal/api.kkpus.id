'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('member_financial_summaries', {
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
      simpanan_pokok: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      simpanan_wajib: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      simpanan_sukarela: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tabungan_reguler: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      tabungan_details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      jual_beli_total: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      jual_beli_sisa_cicilan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      jual_beli_terbayar: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      jual_beli_belum_dibayar_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      pinjaman_total_tagihan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      pinjaman_nominal_kredit: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      pinjaman_nominal_cicilan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      pinjaman_sisa_cicilan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      pinjaman_terbayar: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      arisan_total_tagihan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      arisan_sisa_cicilan: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      arisan_terbayar: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },
      arisan_diikuti_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_investasi: {
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
    await queryInterface.dropTable('member_financial_summaries');
  }
};
