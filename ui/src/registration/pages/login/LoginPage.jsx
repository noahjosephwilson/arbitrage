"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getCurrentUser, signOut } from "aws-amplify/auth";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      try {
        const existingUser = await getCurrentUser();
        if (existingUser) {
          console.log("⚠️ Existing user found, signing out...");
          await signOut({ global: true });
        }
      } catch (err) {
        console.log("ℹ️ No existing user signed in.");
      }

      const user = await signIn({ username: email, password });
      console.info("=== Sign-in Response ===", user);

      if (user?.nextStep?.signInStep === "DONE") {
        const currentUser = await getCurrentUser();
        console.log("✅ Sign-in complete!", currentUser);
        router.push("/main/logo");
      } else if (user?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`/registration/confirmemail?email=${encodeURIComponent(email)}`);
      } else {
        setErrorMsg("Unexpected sign-in status. Please contact support.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Sign-in error:", error);
      setErrorMsg(error.message || "Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    if (!loading) router.push(path);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <button
          onClick={() => handleNavigate("/landing")}
          className={styles.backButton}
          disabled={loading}
          style={{
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.6 : 1,
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: "var(--primary-green)",
          }}
        >
          &larr; Back
        </button>

        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>

        <h2 className={styles.title}>Log In</h2>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              className={styles.inputField}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

          <div className={styles.forgotPasswordContainer}>
            <button
              type="button"
              onClick={() => handleNavigate("/registration/forgotpassword")}
              className={styles.forgotPasswordLink}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                fontSize: "1rem",
                textDecoration: "underline",
                color: "var(--primary-green)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.noAccount}>
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => handleNavigate("/registration/signup")}
            className={styles.signupLink}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              fontSize: "1rem",
              textDecoration: "underline",
              color: "var(--primary-green)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;