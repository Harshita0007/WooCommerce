const { Sequelize } = require('sequelize');
require('dotenv').config();

// Using SQLite (no server needed)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Unable to connect to database:', err));

module.exports = sequelize;