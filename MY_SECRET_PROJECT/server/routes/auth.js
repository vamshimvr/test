// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const db = require('../dbconfig/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/register', registerUser);
router.post('/login', loginUser);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email function
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Use this OTP to reset your password: ${otp}. It is valid for 5 minutes.`,
  });
}

// Endpoint 1: Request OTP
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userCheck.rowCount === 0) return res.status(404).json({ message: 'User not found' });

  const otp = generateOTP();

  await db.query('INSERT INTO password_reset_otps (email, otp) VALUES ($1, $2)', [email, otp]);
  await sendOTPEmail(email, otp);

  res.json({ message: 'OTP sent to email' });
});

// Endpoint 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const result = await db.query(`
    SELECT * FROM password_reset_otps
    WHERE email = $1 AND otp = $2
    AND created_at >= NOW() - INTERVAL '5 minutes'
  `, [email, otp]);

  if (result.rowCount === 0) return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified' });
});

// Endpoint 3: Reset Password
const bcrypt = require('bcrypt');

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  await db.query('UPDATE users SET password = $1 WHERE email = $2', [hash, email]);

  // Clean up OTPs after reset
  await db.query('DELETE FROM password_reset_otps WHERE email = $1', [email]);

  res.json({ message: 'Password reset successfully' });
});

module.exports = router;
