require('dotenv').config();
const app = require('./app');
const { sequelize, syncDatabase } = require('./models');

const PORT = process.env.PORT || 3002;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('ms-lands: DB conectada');
    
    await syncDatabase();
    console.log('ms-lands: Tablas sincronizadas');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`ms-lands: corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('ms-lands error:', error);
    process.exit(1);
  }
};

start();