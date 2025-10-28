const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  changeEmail,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-email", auth, changeEmail);

module.exports = router;
