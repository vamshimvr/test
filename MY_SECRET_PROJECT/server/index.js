const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const pool = require('./dbconfig/db');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const cron = require('node-cron');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ Connected to DB at:', result.rows[0].now);
  }
});

cron.schedule('* * * * *', async () => {
  try {
    const result = await db.query(`
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
