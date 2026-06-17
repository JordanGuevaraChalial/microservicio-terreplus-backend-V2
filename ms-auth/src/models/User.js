const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('inversionista', 'agricultor', 'admin_sistema'), allowNull: false, defaultValue: 'agricultor' },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  foto_perfil: { type: DataTypes.STRING, allowNull: true, defaultValue: '/images/default-avatar.png' }
}, { tableName: 'usuarios', timestamps: false });

User.prototype.esAdministrador = function() {
  return this.rol === 'admin_sistema';
};

module.exports = User;