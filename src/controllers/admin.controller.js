const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");

// ====== DANH SÁCH NHẸ ======
exports.getUsersList = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Query nhẹ, chỉ từ bảng users
    const result = await pool.request().query(`
      SELECT id, email, display_name, avatar_url, is_email_verified, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    success(res, result.recordset, "Lấy danh sách users thành công");
  } catch (err) {
    error(res, 500, err.message);
  }
};

// ====== XEM CHI TIẾT ======
exports.getUserDetail = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`
        SELECT * 
        FROM vw_UserProfiles
        WHERE user_id = @id
      `);

    if (result.recordset.length === 0)
      return error(res, 404, "Không tìm thấy user");

    success(res, result.recordset[0], "Lấy thông tin chi tiết thành công");
  } catch (err) {
    error(res, 500, err.message);
  }
};

// ====== TẠO USER ======
exports.createUser = async (req, res) => {
  res.json({ message: "Tạo user – chưa code" });
};

// ====== CẬP NHẬT USER ======
exports.updateUser = async (req, res) => {
  res.json({ message: "Update user – chưa code" });
};

// ====== XÓA USER ======
exports.deleteUser = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`
        DELETE FROM users WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return error(res, 404, "Không tìm thấy user để xóa");

    success(res, null, "Xóa user thành công");
  } catch (err) {
    error(res, 500, err.message);
  }
};

