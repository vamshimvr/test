// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../dbconfig/db");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/email");
const rateLimit = require("express-rate-limit");
const cookie = require("cookie");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // allow 6 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." }
});

// limiter for forgot-password endpoints (protect from abuse)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8, // up to 8 OTP requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many OTP requests. Try again later." }
});

function redirectForRole(role) {
  // central mapping; change as needed
  const map = {
    user: "/wardrobe",
    advisor: "/advisor",
    developer: "/developer",
    tester: "/tester",
    admin: "/admin",
  };
  return map[role] || "/"; // default
}

/**
 * POST /api/auth/register
 * { name, email, mobile, password, role? }
 */
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const hashed = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (name, email, mobile, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, role, name
    `;
    const values = [name || null, email.toLowerCase(), mobile || null, hashed, role || "user"];
    const { rows } = await pool.query(query, values);
    const user = rows[0];
    return res.json({ success: true, user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * { email, password }
 * returns: { success, token, role, redirectTo }
 */
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  // ... validate & verify user ...
  const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  // cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // 'None' if cross-site in prod behind HTTPS
    maxAge: (process.env.JWT_COOKIE_EXPIRES_DAYS ? parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) : 7) * 24 * 60 * 60 * 1000, // default 7 days
    // domain: 'yourdomain.com' // optionally set domain in production
  };

  // set cookie
  res.cookie("token", token, cookieOptions);

  // also return role + redirectTo in JSON body so frontend can redirect immediately
  const redirectTo = redirectForRole(user.role);
  return res.json({ success: true, role: user.role, redirectTo });
});

/**
 * POST /api/auth/forgot-password
 * body: { identifier } // email or mobile (we treat email only here)
 *
 * Creates OTP row and emails it (6-digit)
 */
router.post("/forgot-password",  otpLimiter, async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ success: false, message: "Identifier required" });

  const email = identifier.toLowerCase(); // for now assume email
  try {
    // confirm user exists
    const u = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);
    if (!u.rowCount) {
      // For security, don't reveal that user doesn't exist. Still return 200.
      console.warn("Forgot-password request for unknown email:", email);
      return res.status(200).json({ success: true, message: "If the account exists, an OTP was sent." });
    }

    // create OTP + store
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(
      `INSERT INTO password_reset_otps (identifier, otp) VALUES ($1, $2)`,
      [email, otp]
    );

    // send email (async)
    const text = `Your Fashion Advice password reset code: ${otp}. It is valid for 5 minutes.`;
    try {
      await sendMail({ to: email, subject: "Your password reset code", text });
    } catch (sendErr) {
      console.error("Email send error:", sendErr);
      // still respond 200 but log for admins
    }

    return res.json({ success: true, message: "If the account exists, an OTP was sent." });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/forgot-password/resend
 * body: { identifier }
 */
router.post("/forgot-password/resend",  otpLimiter, async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ success: false, message: "Identifier required" });
  const email = identifier.toLowerCase();

  try {
    const u = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (!u.rowCount) return res.status(200).json({ success: true, message: "If the account exists, an OTP was sent." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(`INSERT INTO password_reset_otps (identifier, otp) VALUES ($1, $2)`, [email, otp]);

    const text = `Your new password reset code: ${otp}. Valid for 5 minutes.`;
    try {
      await sendMail({ to: email, subject: "Your password reset code (resend)", text });
    } catch (sendErr) {
      console.error("Email send error:", sendErr);
    }

    return res.json({ success: true, message: "If the account exists, an OTP was sent." });
  } catch (err) {
    console.error("resend error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/verify-otp
 * body: { identifier, otp }
 *
 * verifies otp and returns a short-lived token for reset (or allows immediate reset)
 */
router.post("/verify-otp", async (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) return res.status(400).json({ success: false, message: "Required" });

  try {
    // look for a matching OTP created in last 7 min (cron purges older ones)
    const { rows } = await pool.query(
      `SELECT id, otp, created_at FROM password_reset_otps
       WHERE identifier = $1 AND otp = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [identifier.toLowerCase(), otp]
    );

    const row = rows[0];
    if (!row) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    // on success, delete all OTPs for identifier (consume)
    await pool.query(`DELETE FROM password_reset_otps WHERE identifier = $1`, [identifier.toLowerCase()]);

    // Optional: return a short-lived JWT that allows resetting password
    const resetToken = jwt.sign({ sub: identifier.toLowerCase(), purpose: "reset" }, JWT_SECRET, { expiresIn: "15m" });

    return res.json({ success: true, message: "OTP verified", resetToken });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/reset-password
 * body: { resetToken, newPassword }
 * Uses resetToken returned by verify-otp (or other secure flow)
 */
router.post("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ success: false, message: "Required" });

  try {
    const payload = jwt.verify(resetToken, JWT_SECRET);
    if (payload.purpose !== "reset") return res.status(400).json({ success: false, message: "Invalid token" });

    const identifier = payload.sub; // email
    const hashed = await bcrypt.hash(newPassword, 12);

    const result = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email`,
      [hashed, identifier]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("reset-password error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// server/routes/auth.js (add)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return res.json({ success: true, message: "Logged out" });
});


module.exports = router;
