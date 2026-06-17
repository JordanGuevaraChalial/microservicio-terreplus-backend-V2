const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: true,
    define: {
      timestamps: true,
      underscored: true,
    }
  }
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize: Conexión establecida correctamente.');
  } catch (error) {
    console.error('❌ Sequelize: Error de conexión:', error);
  }
};

checkConnection();

module.exports = sequelize;
