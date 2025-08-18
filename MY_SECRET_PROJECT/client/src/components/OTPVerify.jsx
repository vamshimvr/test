// src/components/OTPVerify.jsx
import React from "react";
import styles from "./OTPVerify.module.css";

export default function OTPVerify({ otp, setOtp, onVerify, onResend, loading, error }) {
  const onChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    // auto-focus next
    if (val) {
      const nextEl = document.getElementById(`otp-${i + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}><div className={styles.dot} /><span>OTP</span></div>

        <h1 className={styles.title}>Enter OTP</h1>
        <p className={styles.sub}>Please enter the 6 digit code sent to your email.</p>

        <div className={styles.otpRow}>
          {otp.map((val, i) => (
            <input
              key={i}
              id={`otp-${i + 1}`}
              className={styles.box}
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
            />
          ))}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className={styles.cta} onClick={onVerify} disabled={loading}>
            {loading ? "Verifying…" : "Verify"}
          </button>

          <button className={styles.alt} onClick={onResend} disabled={loading}>
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
