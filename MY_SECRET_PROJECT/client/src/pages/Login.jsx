// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import ForgotPassword from "../components/ForgotPassword";
import OTPVerify from "../components/OTPVerify";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot/OTP modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState("email"); // 'email' | 'otp'
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Force dark theme while on login
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend /auth/login, then navigate on success
    console.log("login:", { email, password });
    // Example: navigate("/wardrobe");
  };

  async function submitLogin(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    credentials: "include",         // IMPORTANT — send+receive cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok && data.success) {
    // token is now stored in HttpOnly cookie — frontend can't read it
    // server returned role + redirectTo so front-end can navigate:
    window.location.href = data.redirectTo || "/";
  } else {
    // show error message
    alert(data.message || "Login failed");
  }
}

  // --- Forgot password flow (frontend -> backend calls) ---

  // Step 1: request backend to send OTP to the registered email/mobile
  const sendOtpRequest = async () => {
    setError("");
    if (!email?.trim()) {
      setError("Please enter your registered email or mobile.");
      return;
    }

    setLoading(true);
    try {
      // adjust URL to your backend endpoint
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      // backend accepted and sent OTP
      setModalStep("otp");
      // clear previous OTP input
      setOtp(Array(6).fill(""));
    } catch (err) {
      setError(err.message || "Unable to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP with backend
  const verifyOtpRequest = async () => {
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      // adjust URL to your backend endpoint
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim(), otp: otpStr }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "OTP verification failed");
      }

      // verified — close modal and optionally notify user
      setModalOpen(false);
      setModalStep("email");
      setOtp(Array(6).fill(""));
      alert("OTP verified. You can now log in with your new password.");
      // Optionally redirect to reset password page or open reset UI:
      // navigate("/reset");
    } catch (err) {
      setError(err.message || "OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP (calls same endpoint)
  const resendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to resend OTP");
      alert("OTP resent — check your email or SMS.");
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to open modal in email entry step
  const openForgotModal = () => {
    setError("");
    setModalStep("email");
    setOtp(Array(6).fill(""));
    setModalOpen(true);
  };

  // keyboard ESC to close modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
        setModalStep("email");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

return (
    <>
      {/* page background/container (never gets modal) */}
      <div className={styles.container}>
        {/* contentWrap is the element we blur when modalOpen is true */}
        <div className={`${styles.contentWrap} ${modalOpen ? styles.blur : ""}`}>
          <div className={styles.card}>
            <h1 className={styles.title}>Welcome Back</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className={styles.primaryBtn}>Login</button>
            </form>

            <p className={styles.linkRow}>
              <a onClick={openForgotModal}>Forgot Password?</a>
            </p>

            <p className={styles.linkRow}>
              Don’t have an account?{" "}
              <a onClick={() => navigate("/signup")}>Sign up</a>
            </p>
          </div>
        </div>
      </div>

      {/* Modal is now rendered outside the blurred contentWrap so it won't be blurred */}
      {modalOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <button
              className={styles.modalClose}
              aria-label="Close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            {modalStep === "email" && (
              <ForgotPassword
                email={email}
                setEmail={setEmail}
                onSend={sendOtpRequest}
                loading={loading}
                error={error}
              />
            )}

            {modalStep === "otp" && (
              <OTPVerify
                otp={otp}
                setOtp={setOtp}
                onVerify={verifyOtpRequest}
                onResend={resendOtp}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
