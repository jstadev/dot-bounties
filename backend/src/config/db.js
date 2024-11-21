const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: false,
  }
);

module.exports = sequelize;
