// File: src/controllers/profile.routes.js

const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require('../middlewares/upload.middleware'); // <-- Import middleware mới

// Route cho Nickname
// POST /api/profile/update-nickname
router.post(
  "/update-nickname", 
  protect, 
  profileController.updateNickname
);

// Route cho Avatar
// POST /api/profile/upload-avatar
router.post(
  "/upload-avatar", 
  protect, 
  upload.single('avatar'), // 'avatar' là tên field mà Frontend sẽ gửi lên
  profileController.uploadAvatar
);

module.exports = router;