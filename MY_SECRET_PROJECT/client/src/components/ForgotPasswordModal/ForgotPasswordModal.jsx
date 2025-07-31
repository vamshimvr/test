// src/components/ForgotPasswordModal/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import styles from './ForgotPasswordModal.module.css';

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) setStep(2);
  };

  const handleVerifyOtp = async () => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) setStep(3);
  };

  const handleResetPassword = async () => {
    if (newPass !== confirmPass) {
      setMessage("Passwords don't match");
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: newPass }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h3>Forgot Password</h3>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
