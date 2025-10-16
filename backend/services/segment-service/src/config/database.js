const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use in-memory SQLite for Render (shares data via API calls)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

module.exports = sequelize;