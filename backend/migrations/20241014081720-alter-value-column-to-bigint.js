'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "bounties"
      ALTER COLUMN "value" TYPE BIGINT USING (value::bigint);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "bounties"
      ALTER COLUMN "value" TYPE VARCHAR USING (value::VARCHAR);
    `);
  }
};