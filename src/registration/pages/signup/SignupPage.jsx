"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the hook
import { auth } from "@/firebaseConfig"; // adjust the path as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // reset any previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User created successfully. Navigate to the new page.
      console.log("User created:", userCredential.user);
      router.push("/main/logo"); // Replace with your desired route
    } catch (error) {
      console.error("Error creating user:", error);
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
