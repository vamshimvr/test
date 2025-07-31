import React, { useState } from 'react';
import styles from './Login.module.css';
import ForgotPasswordModal from '../components/ForgotPasswordModal/ForgotPasswordModal';
import shirtFace from '../assets/tshirt.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // handle login API here
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.cardContainer} ${flipped ? styles.flipped : ''}`}>
        
        {/* FRONT */}
        <div className={styles.front}>
          <img
            src={shirtFace}
            alt="Shirt Face"
            className={styles.shirtImage}
            onClick={() => setFlipped(true)}
          />
        </div>

        {/* BACK */}
        <div className={styles.back}>
          <button className={styles.closeBtn} onClick={() => setFlipped(false)}>✖</button>

          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h2 className={styles.heading}>Login</h2>

            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword} 
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className={styles.forgotWrapper}>
              <span
                className={styles.forgot}
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </span>
            </div>

            <button className={styles.button} type="submit">Login</button>
          </form>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
}

export default Login;
