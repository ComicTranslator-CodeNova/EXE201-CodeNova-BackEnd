const jwt = require("jsonwebtoken");
const { poolPromise } = require("../utils/db");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ DB và gán vào req.user (không bao gồm password_hash)
      const pool = await poolPromise;
      const result = await pool.request()
        .input("id", decoded.id)
        .query("SELECT id, email, display_name FROM users WHERE id = @id");
      
      req.user = result.recordset[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
