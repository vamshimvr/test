import React, { useState } from 'react';
import styles from './Register.module.css';
import shirtImage from '../assets/tshirt.png';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Register() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Submit to backend
    console.log('Registering:', form);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`}
      >
        <div className={styles.front}>
          <img
            src={shirtImage}
            alt="shirt face"
            className={styles.shirtImage}
            onClick={() => setIsFlipped(true)}
          />
        </div>
        <div className={styles.back}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Register</h2>

            <input
              className={styles.input}
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className={styles.passwordInput}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <div className={styles.passwordInput}>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <button className={styles.button} type="submit">Register</button>
            <button type="button" className={styles.flipBack} onClick={() => setIsFlipped(false)}>Go to Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
