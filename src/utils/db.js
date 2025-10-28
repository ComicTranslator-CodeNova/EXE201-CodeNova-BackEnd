const sql = require("mssql");
const { DB } = require("../config/env");

const config = {
  user: DB.user,
  password: DB.password,
  server: DB.server,
  port: DB.port,
  database: DB.database,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
