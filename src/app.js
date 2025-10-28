const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./utils/db");
const routes = require("./routes");
const { API_PREFIX } = require("./config/constants");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT GETDATE() as now");
    res.send("✅ Server OK — DB time: " + result.recordset[0].now);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use(API_PREFIX, routes);

module.exports = app;
