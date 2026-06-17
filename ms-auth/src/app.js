const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ms-auth' }));
app.get('/', (req, res) => res.json({ service: 'ms-auth', version: '1.0.0' }));

// RUTAS
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app); 

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada en ms-auth" });
});

module.exports = app;
