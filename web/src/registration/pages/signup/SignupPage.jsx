"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import { signUp, getCurrentUser, signOut } from "aws-amplify/auth";
import awsconfig from "@/aws-exports";
import styles from "./SignupPage.module.css";

Amplify.configure(awsconfig);

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      try {
        const existingUser = await getCurrentUser();
        if (existingUser) {
          await signOut({ global: true });
        }
      } catch (_) {}

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      });

      sessionStorage.setItem("signupEmail", email);
      sessionStorage.setItem("signupPassword", password);
      router.push(`/registration/confirmemail?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("❌ Signup error:", error);
      setErrorMsg(error.message || "Signup failed.");
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

        <h2 className={styles.title}>Sign Up</h2>

        <form className={styles.signupForm} onSubmit={handleSignup}>
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
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => handleNavigate("/registration/login")}
            className={styles.loginLink}
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
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
