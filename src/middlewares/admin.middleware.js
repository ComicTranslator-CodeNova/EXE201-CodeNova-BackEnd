const { poolPromise, sql } = require("../utils/db");

module.exports = async (req, res, next) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, req.user.id)
      .query(`
        SELECT r.name
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = @user_id
      `);

    if (result.recordset.length === 0 || result.recordset[0].name !== "admin") {
      return res.status(403).json({ error: "Không có quyền admin" });
    }

    next();
  } catch (err) {
    console.error("❌ Lỗi isAdmin:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
