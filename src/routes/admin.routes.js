const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");

const adminController = require("../controllers/admin.controller");

// ===== DANH SÁCH NHẸ =====
// GET /admin/users
router.get("/users", auth, isAdmin, adminController.getUsersList);

// ===== XEM CHI TIẾT USER =====
// GET /admin/users/:id
router.get("/users/:id", auth, isAdmin, adminController.getUserDetail);

// ===== TẠO USER =====
// POST /admin/users
router.post("/users", auth, isAdmin, adminController.createUser);

// ===== CẬP NHẬT USER =====
// PUT /admin/users/:id
router.put("/users/:id", auth, isAdmin, adminController.updateUser);

// ===== XÓA USER =====
// DELETE /admin/users/:id
router.delete("/users/:id", auth, isAdmin, adminController.deleteUser);

module.exports = router;
