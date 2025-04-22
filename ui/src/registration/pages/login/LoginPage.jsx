"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getCurrentUser } from "aws-amplify/auth";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const user = await signIn({ username: email, password });
      console.info("=== Sign-in Response ===", user);

      if (user?.nextStep?.signInStep === "DONE") {
        console.log("✅ Sign-in complete!");

        // Print the current authenticated user
        try {
          const currentUser = await getCurrentUser();
          console.log("=== Current Authenticated User ===");
          console.log(currentUser);
        } catch (err) {
          console.error("Failed to fetch current user after login:", err);
        }

        router.push("/main/logo");
      } else if (user?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        console.warn("⚠️ User needs to confirm email.");
        router.push(`/registration/confirmemail?email=${encodeURIComponent(email)}`);
      } else {
        console.warn("⚠️ Unexpected sign-in state:", user);
        setErrorMsg("Unexpected sign-in status. Please contact support.");
      }
    } catch (error) {
      console.error("❌ Sign-in error:", error);
      setErrorMsg(error.message || "Failed to sign in. Please try again.");
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
            <label htmlFor="email" className={styles.label}>Email</label>
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
            <label htmlFor="password" className={styles.label}>Password</label>
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

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

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
