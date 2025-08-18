const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

const pool = require('./dbconfig/db');

const cron = require('node-cron');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  credentials: true, // allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);


pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ Connected to DB at:', result.rows[0].now);
  }
});

cron.schedule('* * * * *', async () => {
  try {
    const result = await pool.query(`
      DELETE FROM password_reset_otps
      WHERE created_at < NOW() - INTERVAL '5 minutes'
    `);
    if (result.rowCount > 0) {
      console.log(`[CRON] Deleted ${result.rowCount} expired OTP(s)`);
    }
  } catch (error) {
    console.error('[CRON ERROR] Failed to delete expired OTPs:', error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
