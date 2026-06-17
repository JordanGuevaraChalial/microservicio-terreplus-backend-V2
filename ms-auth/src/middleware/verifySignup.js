const User = require('../models/User');

const checkDuplicateEmail = async (req, res, next) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ 
        message: "No se recibió el correo electrónico en la petición." 
      });
    }

    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({ message: "¡Error! El email ya está en uso." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  const roles = ['inversionista', 'agricultor', 'admin_sistema'];
  if (req.body.rol && !roles.includes(req.body.rol)) {
    return res.status(400).json({
      message: `¡Error! El rol '${req.body.rol}' no existe.`
    });
  }
  next();
};

module.exports = {
  checkDuplicateEmail,
  checkRolesExisted
};