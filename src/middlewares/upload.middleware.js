// File: src/middlewares/upload.middleware.js

const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Sử dụng path.resolve để có đường dẫn tuyệt đối đến thư mục gốc của dự án
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: "userid-timestamp.extension"
    const userId = req.user.id; // Lấy từ middleware 'protect'
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Chỉ cho phép upload file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB (giống database)
});

module.exports = upload;