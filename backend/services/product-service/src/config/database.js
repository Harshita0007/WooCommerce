const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use in-memory SQLite for Render (data resets on restart)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Unable to connect to database:', err));

module.exports = sequelize;