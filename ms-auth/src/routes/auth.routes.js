const { verifyToken } = require("../middleware/authJwt");
const { checkDuplicateEmail, checkRolesExisted } = require("../middleware/verifySignup");
const controller = require("../controllers/auth.controller");

console.log('Controller functions:', Object.keys(controller));

module.exports = function(app) {
  // Registro - USA LAS FUNCIONES CORRECTAS
  app.post("/api/auth/signup", [checkDuplicateEmail, checkRolesExisted], controller.registrar);
  
  // Login - USA LA FUNCIÓN CORRECTA
  app.post("/api/auth/signin", controller.login);
  
  // Verificar token
  app.get("/api/auth/verify", verifyToken, (req, res) => {
    res.json({ valid: true, userId: req.userId });
  });
};