const dotenv = require("dotenv");
const path = require("path");

// Load backend/.env regardless of where the process is started from.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  // Comma-separated list of allowed origins for CORS (frontend URL).
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
};

if (!env.DATABASE_URL) {
  console.warn(
    "[env] DATABASE_URL is not set. Copy backend/.env.example to backend/.env and add your DB link."
  );
}

module.exports = env;
