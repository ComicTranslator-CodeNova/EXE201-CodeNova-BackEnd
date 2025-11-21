const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

// User bấm "Chọn gói" -> tạo order Momo
router.post("/momo/create", auth, paymentController.createMomoPayment);

// Momo gọi về khi thanh toán xong
router.post("/momo/ipn", paymentController.handleMomoIPN);

module.exports = router;
