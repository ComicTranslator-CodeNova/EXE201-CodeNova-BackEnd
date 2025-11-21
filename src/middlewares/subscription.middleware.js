const { poolPromise, sql } = require("../utils/db");

module.exports = async (req, res, next) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, req.user.id)
      .query(`
        SELECT TOP 1 s.*, p.slug
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.user_id = @user_id
          AND s.status = 'active'
          AND s.end_at >= SYSDATETIMEOFFSET()
        ORDER BY s.end_at DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(403).json({
        error: "Bạn chưa có gói dịch truyện đang hoạt động"
      });
    }

    // Nếu cần, gắn thông tin plan vào req
    req.subscription = result.recordset[0];

    next();
  } catch (err) {
    console.error("❌ subscription middleware error:", err);
    res.status(500).json({ error: "Lỗi server khi kiểm tra gói" });
  }
};
