const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // dạng "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Thiếu token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token không hợp lệ" });
    req.user = user; // { id, email }
    next();
  });
};
