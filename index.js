require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");

const app = express();
app.use(cors());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());
const auth = require("./auth");


app.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT GETDATE() as now");
    res.send("Server ok, DB time: " + result.recordset[0].now);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/** ========== REGISTER ========== */
app.post("/api/register", async (req, res) => {
  const { email, password, display_name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
  }

  try {
    const pool = await poolPromise;

    // Kiểm tra email đã tồn tại chưa
    const check = await pool.request()
      .input("email", email)
      .query("SELECT id FROM users WHERE email = @email");

    if (check.recordset.length > 0) {
      return res.status(400).json({ error: "Email đã được đăng ký" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await pool.request()
      .input("email", email)
      .input("display_name", display_name || null)
      .query(`
        INSERT INTO users (email, display_name)
        OUTPUT inserted.id
        VALUES (@email, @display_name)
      `);

    const userId = user.recordset[0].id;

    // Gắn thông tin đăng nhập vào auth_providers
    await pool.request()
      .input("user_id", userId)
      .input("provider", "local")
      .input("password_hash", hash)
      .query(`
        INSERT INTO auth_providers (user_id, provider, password_hash)
        VALUES (@user_id, @provider, @password_hash)
      `);

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** ========== LOGIN ========== */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
  }

  try {
    const pool = await poolPromise;

    const user = await pool.request()
      .input("email", email)
      .query(`
        SELECT u.id, u.email, u.display_name, a.password_hash
        FROM users u
        JOIN auth_providers a ON a.user_id = u.id
        WHERE u.email = @email AND a.provider = 'local'
      `);

    if (user.recordset.length === 0) {
      return res.status(400).json({ error: "Email chưa được đăng ký" });
    }

    const row = user.recordset[0];
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: row.id, email: row.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // (tuỳ chọn) lưu session vào bảng sessions
    await pool.request()
      .input("user_id", row.id)
      .input("session_token", token)
      .query(`
        INSERT INTO sessions (user_id, session_token)
        VALUES (@user_id, @session_token)
      `);

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: { id: row.id, email: row.email, display_name: row.display_name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/profile", auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", req.user.id)
      .query("SELECT id, email, display_name FROM users WHERE id = @id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(process.env.PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${process.env.PORT}`)
);
