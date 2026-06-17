require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('ms-auth: DB conectada');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`ms-auth: corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('ms-auth error:', error);
    process.exit(1);
  }
};

start();