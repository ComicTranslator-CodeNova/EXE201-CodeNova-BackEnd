const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  changeEmail,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-email", protect, changeEmail);

module.exports = router;
