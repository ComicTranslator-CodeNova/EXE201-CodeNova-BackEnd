const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");

// ========== LẤY PROFILE NGƯỜI DÙNG ==========
exports.getProfile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .query(`SELECT * FROM vw_UserProfiles WHERE user_id = @id`);
    if (result.recordset.length === 0)
      return error(res, 404, "Không tìm thấy người dùng");
    success(res, result.recordset[0], "Lấy profile thành công");
  } catch (err) {
    error(res, 500, err.message);
  }
};

// ========== CẬP NHẬT PROFILE ==========
exports.updateProfile = async (req, res) => {
  // Lấy các trường có thể cập nhật từ body.
  // avatar_url được loại trừ một cách có chủ đích vì nó được quản lý bởi endpoint /api/profile/upload-avatar.
  const { bio, location, website } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("bio", sql.NVarChar, bio)
      .input("location", sql.NVarChar, location)
      .input("website", sql.NVarChar, website)
      .query(`
        EXEC sp_UpdateUserProfile @user_id = @id, @bio = @bio, @location = @location, @website = @website;
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