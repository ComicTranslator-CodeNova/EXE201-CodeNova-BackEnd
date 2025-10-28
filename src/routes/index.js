const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes"); // ta sẽ tách từ app.js

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
