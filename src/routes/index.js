const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes"); // ta sẽ tách từ app.js
const profileRoutes = require("./profile.routes");

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;