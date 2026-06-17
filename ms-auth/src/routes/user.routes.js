const { verifyToken } = require("../middleware/authJwt");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
  // Perfil de usuario
  app.get("/api/user/profile", [verifyToken], userController.obtenerPerfil);
  app.put("/api/user/profile", [verifyToken], userController.actualizarPerfil);
};