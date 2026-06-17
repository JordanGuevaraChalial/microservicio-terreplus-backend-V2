const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

exports.registrar = async (req, res) => {
  try {
    const user = await User.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      rol: req.body.rol || 'agricultor'
    });
    res.status(201).json({ 
      message: "Usuario registrado exitosamente", 
      user: { id: user.id, email: user.email, nombre: user.nombre } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol }, 
      config.secret, 
      { expiresIn: config.jwtExpiration }
    );

    res.json({ 
      id: user.id, 
      nombre: user.nombre, 
      email: user.email, 
      rol: user.rol, 
      accessToken: token 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Función adicional para verificar token (si la necesitas)
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.secret);
  } catch {
    return null;
  }
};