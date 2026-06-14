'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('materials', 'quiz_questions', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'is_unlocked'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('materials', 'quiz_questions');
  }
};
