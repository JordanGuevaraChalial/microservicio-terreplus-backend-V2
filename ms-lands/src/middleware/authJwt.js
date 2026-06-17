const jwt = require('jsonwebtoken');

// La clave JWT debe ser la misma que en ms-auth
const JWT_SECRET = process.env.JWT_SECRET || 'terreplus-secret-key-2026';

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "¡No autorizado! Token inválido o expirado." });
    }
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

// Verificar si es administrador (usa el rol del token)
const isAdmin = (req, res, next) => {
  if (req.userRol === 'admin_sistema' || req.userRol === 'admin_publico') {
    next();
  } else {
    res.status(403).json({ message: "¡Requiere rol de Administrador!" });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};