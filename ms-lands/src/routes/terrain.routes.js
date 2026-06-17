const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/terrain.controller");

module.exports = function(app) {
  app.post("/api/terrain", [authJwt.verifyToken], controller.crearTerreno);
  app.get("/api/terrain/my-list", [authJwt.verifyToken], controller.obtenerMisTerrenos);
  app.get("/api/terrain/all", [authJwt.verifyToken], controller.obtenerTodosTerrenos);
};