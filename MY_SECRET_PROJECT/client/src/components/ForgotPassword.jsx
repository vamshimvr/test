
import React from "react";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword({ email, setEmail, onSend, loading, error }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.sub}>Enter your registered email or mobile. We'll send a 6-digit code.</p>

        <label className={styles.field}>
          <span className={styles.label}>Email or Mobile</span>
          <input
            className={styles.input}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com or +91 9xxxxxxxxx"
            autoFocus
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={styles.cta}
            onClick={onSend}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
