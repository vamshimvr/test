// server/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function requireAuth(req, res, next) {
  try {
    // 1) check Authorization header
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) fallback to cookie (HttpOnly)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };