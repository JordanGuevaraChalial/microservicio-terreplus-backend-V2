module.exports = {
  secret: process.env.JWT_SECRET || "terreplus-secret",
  jwtExpiration: 3600,
  jwtRefreshExpiration: 86400
};