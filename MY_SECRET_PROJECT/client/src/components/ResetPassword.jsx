import { useState } from "react";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [form, setForm] = useState({ otp: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: submit reset
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={submit}>
        <h1 className={styles.title}>Reset Password</h1>
        <label className={styles.field}>
          <span className={styles.label}>OTP</span>
          <input className={styles.input} name="otp" value={form.otp} onChange={onChange} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>New Password</span>
          <input className={styles.input} type="password" name="password" value={form.password} onChange={onChange}/>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Confirm Password</span>
          <input className={styles.input} type="password" name="confirm" value={form.confirm} onChange={onChange}/>
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.cta}>Update Password</button>
      </form>
    </div>
  );
}
