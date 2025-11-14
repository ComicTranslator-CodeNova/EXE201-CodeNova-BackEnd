const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./utils/db");
const routes = require("./routes");
const { API_PREFIX } = require("./config/constants");
const path = require("path"); // <-- THÊM DÒNG NÀY
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());
// Bật trust proxy để lấy đúng req.ip khi chạy sau proxy (Nginx, Heroku, etc.)
app.enable("trust proxy");

// THÊM DÒNG NÀY để public thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


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

// Middleware xử lý lỗi phải được đặt ở cuối cùng
app.use(errorMiddleware);

module.exports = app;
