const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/history.controller");
const userController = require("../controllers/user.controller");
const factorController = require("../controllers/factor.controller");

module.exports = function(app) {
  // Historial de consultas del usuario
  app.get("/api/user/history", [authJwt.verifyToken], controller.obtenerHistorialUsuario);
  app.get("/api/user/history/:id", [authJwt.verifyToken], controller.obtenerDetalleConsulta);
  app.delete("/api/user/history/:id", [authJwt.verifyToken], controller.eliminarConsulta);
  
  // Perfil de usuario (redirige a ms-auth o da info básica)
  app.get("/api/user/profile", [authJwt.verifyToken], userController.obtenerPerfil);
  app.put("/api/user/profile", [authJwt.verifyToken], userController.actualizarPerfil);
  
  // Factores de consulta
  app.get('/api/consultas/:consultaId/factors', [authJwt.verifyToken], factorController.obtenerFactoresDeConsulta);
};