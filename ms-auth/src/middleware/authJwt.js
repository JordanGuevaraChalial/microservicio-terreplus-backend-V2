const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "¡No autorizado! Token inválido o expirado." });
    }
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.userRol === "admin_sistema" || req.userRol === "admin_publico") {
      next();
      return;
    }
    res.status(403).json({ message: "¡Requiere rol de Administrador!" });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar rol de usuario." });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;