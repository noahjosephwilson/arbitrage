"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Import Amplify from "aws-amplify" (this module exports configure)
import { Amplify } from "aws-amplify";
// Import signIn from "aws-amplify/auth"
import { signIn } from "aws-amplify/auth";
import awsconfig from "@/aws-exports";
import styles from "./LoginPage.module.css";

// Configure Amplify globally (ideally in a top-level file)
Amplify.configure(awsconfig);

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Call signIn from aws-amplify/auth
      const user = await signIn({ username: email, password });
      console.info("User signed in:", user);
      router.push("/main/logo");
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMsg(error.message || error.toString());
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <a href="/landing" className={styles.backButton}>
          &larr; Back
        </a>
        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>
        <h2 className={styles.title}>Log In</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.inputField}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          <div className={styles.forgotPasswordContainer}>
            <a href="/registration/forgotpassword" className={styles.forgotPasswordLink}>
              Forgot Password?
            </a>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Log In
          </button>
        </form>
        <p className={styles.noAccount}>
          Don't have an account?{" "}
          <a href="/registration/signup" className={styles.signupLink}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
