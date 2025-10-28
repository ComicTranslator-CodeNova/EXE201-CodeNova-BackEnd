const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");

// ========== LẤY PROFILE NGƯỜI DÙNG ==========
exports.getProfile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .query(`SELECT id, email, display_name, avatar_url, is_email_verified, created_at FROM users WHERE id = @id`);

    if (result.recordset.length === 0)
      return error(res, 404, "Không tìm thấy người dùng");

    success(res, result.recordset[0], "Lấy profile thành công");
  } catch (err) {
    error(res, 500, err.message);
  }
};

// ========== CẬP NHẬT PROFILE ==========
exports.updateProfile = async (req, res) => {
  const { display_name, avatar_url } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("display_name", sql.NVarChar, display_name || null)
      .input("avatar_url", sql.NVarChar, avatar_url || null)
      .query(`
        UPDATE users
        SET display_name = @display_name,
            avatar_url = @avatar_url,
            updated_at = SYSDATETIMEOFFSET()
        WHERE id = @id
      `);

    res.json({ success: true, message: "Cập nhật profile thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật profile:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// ========== ĐỔI EMAIL ==========
exports.changeEmail = async (req, res) => {
  const { new_email } = req.body;
  if (!new_email) return res.status(400).json({ error: "Thiếu email mới" });

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("new_email", sql.NVarChar, new_email)
      .query(`
        UPDATE users
        SET email = @new_email,
            updated_at = SYSDATETIMEOFFSET()
        WHERE id = @id
      `);

    res.json({ success: true, message: "Đổi email thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi đổi email:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
