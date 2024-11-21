// migrations/XXXXXXXXXXXXXX-add-claimed-to-bounties.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bounties', 'claimed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bounties', 'claimed');
  },
};
