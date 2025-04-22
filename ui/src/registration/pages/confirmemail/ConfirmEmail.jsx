"use client";

import React, { useState, useEffect } from "react";
import { confirmSignUp, resendSignUpCode, signIn, signOut } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ConfirmEmail.module.css";

const ConfirmEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      console.log("✅ Email confirmed!");

      const user = await signIn({ username: email, password });
      console.log("✅ User signed in after confirmation:", user);

      setSuccessMsg("Email confirmed and signed in! Redirecting...");
      setTimeout(() => {
        router.push("/main/logo");
      }, 2000);
    } catch (error) {
      console.error("❌ Error confirming email or signing in:", error);
      setErrorMsg(error.message || "Failed to confirm email.");
    }
  };

  const handleResendCode = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await resendSignUpCode({ username: email });
      setSuccessMsg("Confirmation code resent! Check your email.");
    } catch (error) {
      console.error("❌ Error resending code:", error);
      setErrorMsg(error.message || "Failed to resend code.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      console.log("✅ User signed out successfully.");
      router.push("/landing");
    } catch (error) {
      console.error("❌ Error signing out:", error);
      setErrorMsg("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        {/* Replace the Back button with a Sign Out button */}
        <button className={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>

        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>

        <h2 className={styles.title}>Confirm Your Email</h2>

        <form className={styles.loginForm} onSubmit={handleConfirm}>
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

          <div className={styles.formGroup}>
            <label htmlFor="code" className={styles.label}>Confirmation Code</label>
            <input
              type="text"
              id="code"
              className={styles.inputField}
              placeholder="Enter confirmation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

          <button type="submit" className={styles.submitBtn}>
            Confirm Email
          </button>
        </form>

        <p className={styles.noAccount}>
          Didn't get a code?{" "}
          <button className={styles.resendLink} onClick={handleResendCode}>
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
