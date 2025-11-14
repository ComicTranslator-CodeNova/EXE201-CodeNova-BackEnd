const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware"); // <-- THÊM DÒNG NÀY

// Định nghĩa route để cập nhật nickname
// Middleware 'protect' sẽ xác thực token và gắn thông tin user vào req
router.post("/update-nickname", protect, profileController.updateNickname);

// THÊM ROUTE MỚI CHO AVATAR
// protect: Xác thực
// upload.single('avatar'): Bắt file có tên 'avatar' và lưu lại
// profileController.uploadAvatar: Chạy logic controller
router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"), // 'avatar' là tên field mà Frontend sẽ gửi lên
  profileController.uploadAvatar
);

module.exports = router;