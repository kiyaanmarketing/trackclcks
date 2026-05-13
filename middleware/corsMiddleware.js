const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS
      .split(",")
      .map(origin => origin.trim())
  : [];

const corsOptionsDelegate = (req, callback) => {

  const origin = req.header("Origin");

  // No origin (server-to-server)
  if (!origin) {
    return callback(null, {
      origin: true
    });
  }

  // Allow proxy iframe
  if (req.path === "/api/proxy-iframe") {
    return callback(null, {
      origin: true
    });
  }

  // Match allowed origins
  if (allowedOrigins.includes(origin)) {

    callback(null, {
      origin: true,
      credentials: true,

      methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
      ],

      allowedHeaders: [
        "Content-Type",
        "Authorization"
      ]
    });

  } else {

    console.warn(
      `🚫 CORS blocked origin: ${origin}`
    );

    callback(null, {
      origin: false
    });
  }
};

module.exports = cors(corsOptionsDelegate);