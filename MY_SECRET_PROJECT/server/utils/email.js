// server/utils/email.js
const nodemailer = require("nodemailer");

let transporter;
function initTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // fallback: a simple logger transport (for development)
    transporter = {
      sendMail: async (mailOptions) => {
        console.log("[EMAIL FALLBACK] To:", mailOptions.to);
        console.log("[EMAIL FALLBACK] Subject:", mailOptions.subject);
        console.log("[EMAIL FALLBACK] Text:", mailOptions.text);
        return { accepted: [mailOptions.to] };
      },
    };
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const t = initTransporter();
  const info = await t.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return info;
}

module.exports = { sendMail };
