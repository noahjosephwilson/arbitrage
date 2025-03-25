"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // for programmatic navigation
import { auth } from "@/firebaseConfig"; // adjust the path as needed
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset any previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      // Redirect to the desired page after login; adjust route as needed.
      router.push("/main/logo");
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <a href="/landing/landingmarkets/all" className={styles.backButton}>
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
