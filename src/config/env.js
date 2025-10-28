require("dotenv").config();

const requiredEnv = ["DB_USER", "DB_PASS", "DB_HOST", "DB_PORT", "DB_NAME", "PORT", "JWT_SECRET"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn("⚠️ Missing environment variables:", missing.join(", "));
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_key",
  DB: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    database: process.env.DB_NAME,
  },
};
