const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');

  // ✅ Agar origin nahi hai (server-to-server / curl) — allow karo
  if (!origin) {
    return callback(null, { origin: true });
  }

  // ✅ Proxy-iframe endpoint ke liye sab allow karo
  if (req.path === '/api/proxy-iframe') {
    return callback(null, { origin: true });
  }

  // ✅ Allowed origins check
  if (allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
  } else {
    console.warn(`🚫 CORS blocked origin: ${origin}`);
    callback(null, { origin: false });
  }
};

module.exports = cors(corsOptionsDelegate);