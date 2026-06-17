// ms-lands/src/controllers/user.controller.js
// NOTA: Las operaciones de perfil las maneja ms-auth
// Aquí solo redirigimos o devolvemos info básica del token

exports.obtenerPerfil = async (req, res) => {
  try {
    // El perfil completo está en ms-auth
    // Para obtenerlo, el frontend debe llamar a ms-auth directamente
    // O podemos hacer un proxy (pero mejor que el frontend llame a ms-auth)
    res.status(200).json({
      id: req.userId,
      rol: req.userRol || 'usuario',
      message: "Para información completa del perfil, usar endpoint de ms-auth"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    // Las actualizaciones de perfil deben ir a ms-auth
    res.status(200).json({
      message: "Para actualizar perfil, usar endpoint de ms-auth",
      userId: req.userId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};