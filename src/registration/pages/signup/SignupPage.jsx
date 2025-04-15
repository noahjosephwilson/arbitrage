"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import { signUp } from "aws-amplify/auth";
import awsconfig from "@/aws-exports";
import styles from "./SignupPage.module.css";

// Configure Amplify on the client side (only once)
Amplify.configure(awsconfig);

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    console.info(`Signup process initiated for email: ${email}`);

    try {
      // Updated signUp call using the options object for userAttributes and autoSignIn
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email, // using email as the username
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      });
      console.info("User signed up successfully. Response:", {
        isSignUpComplete,
        userId,
        nextStep,
      });
      router.push("/main/markets");
    } catch (error) {
      console.error("Signup process encountered an error:", error);
      setErrorMsg(`Signup failed: ${error.message || error.toString()}`);
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
        <h2 className={styles.title}>Sign Up</h2>
        <form className={styles.signupForm} onSubmit={handleSignup}>
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
          <button type="submit" className={styles.submitBtn}>
            Sign Up
          </button>
        </form>
        <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <a href="/registration/login" className={styles.loginLink}>
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
