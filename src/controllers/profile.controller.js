const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");
const fs = require("fs").promises;
const path = require("path");

/**
 * @desc    Update user nickname
 * @route   POST /api/profile/update-nickname
 * @access  Private
 */
exports.updateNickname = async (req, res) => {
  // Lấy user_id từ middleware xác thực (đã được giải mã từ JWT)
  const userId = req.user.id;
  const { nickname } = req.body;

  // Lấy địa chỉ IP của người dùng từ request (cho sp_UpdateUserNickname)
  const ipAddress = req.ip;

  if (!nickname) {
    return res.status(400).json({ error: "Nickname is required" });
  }

  try {
    const pool = await poolPromise;

    // Gọi Stored Procedure
    await pool
      .request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("new_nickname", sql.NVarChar, nickname)
      .input("ip_address", sql.VarChar, ipAddress)
      .execute("sp_UpdateUserNickname");

    // Trả về thành công
    res.json({ message: "Nickname updated successfully", nickname: nickname });
  } catch (err) {
    console.error("❌ Error updating nickname:", err);

    // Xử lý lỗi từ SQL (ví dụ: "Nickname đã được sử dụng")
    if (err.number === 50001) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Upload user avatar
 * @route   POST /api/profile/upload-avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res, next) => {
  try {
    // 1. Kiểm tra xem file đã được upload bởi multer chưa
    if (!req.file) {
      return res.status(400).json({ error: "Bạn chưa chọn file ảnh." });
    }

    // 2. File đã được lưu, thông tin nằm trong req.file
    const userId = req.user.id;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // 3. Tạo URL để lưu vào database
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // 4. Lấy URL avatar cũ để xóa file
    const pool = await poolPromise;
    const oldAvatarResult = await pool
      .request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query("SELECT avatar_url FROM users WHERE id = @user_id");

    const oldAvatarUrl = oldAvatarResult.recordset[0]?.avatar_url;

    // 5. Gọi Stored Procedure `sp_UploadUserAvatar` để cập nhật DB
    await pool
      .request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("avatar_url", sql.NVarChar, avatarUrl)
      .input("avatar_type", sql.VarChar, "uploaded")
      .input("file_size_bytes", sql.BigInt, fileSize)
      .input("mime_type", sql.VarChar, mimeType)
      .execute("sp_UploadUserAvatar");

    // 6. Xóa file avatar cũ sau khi đã cập nhật DB thành công
    if (oldAvatarUrl && oldAvatarUrl.includes("/uploads/")) {
      const oldAvatarFilename = oldAvatarUrl.split("/uploads/")[1];
      const oldAvatarPath = path.join(process.cwd(), "uploads", oldAvatarFilename);
      await fs.unlink(oldAvatarPath).catch(err => console.warn(`⚠️  Không thể xóa file cũ: ${err.message}`));
    }

    // 7. Trả về link ảnh mới cho Frontend
    res.json({
      message: "Avatar updated successfully",
      avatar_url: avatarUrl,
    });
  } catch (err) {
    console.error("❌ Error uploading avatar:", err);

    // Nếu có lỗi xảy ra, xóa file vừa tải lên để tránh rác
    if (req.file) {
      await fs.unlink(req.file.path).catch(e => console.warn(`⚠️  Không thể xóa file tạm khi có lỗi: ${e.message}`));
    }

    // Chuyển lỗi đến error middleware để xử lý tập trung
    next(err);
  }
};