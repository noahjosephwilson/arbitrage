"use client";

import React, { useState, useEffect } from "react";
import { confirmSignUp, resendSignUpCode, signIn, signOut } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ConfirmEmail.module.css";

const ConfirmEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail");
    const storedPassword = sessionStorage.getItem("signupPassword");
    const queryEmail = searchParams.get("email");

    if (storedEmail || queryEmail) {
      setEmail(storedEmail || queryEmail);
    }

    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, [searchParams]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Email is missing. Please return to the signup page.");
      return;
    }

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      const user = await signIn({ username: email, password });

      sessionStorage.removeItem("signupPassword");
      setSuccessMsg("✅ Email confirmed and signed in! Redirecting...");
      setTimeout(() => router.push("/main/logo"), 2000);
    } catch (error) {
      console.error("❌ Error confirming email or signing in:", error);
      setErrorMsg(error.message || "Failed to confirm email.");
    }
  };

  const handleResendCode = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Email is missing. Please return to the signup page.");
      return;
    }

    try {
      await resendSignUpCode({ username: email });
      setSuccessMsg("🔁 Confirmation code resent. Check your inbox.");
    } catch (error) {
      setErrorMsg(error.message || "Failed to resend code.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      router.push("/landing");
    } catch (error) {
      setErrorMsg("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <button className={styles.signOutButton} onClick={handleSignOut}>
          ← Back
        </button>

        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>

        <h2 className={styles.title}>Confirm Your Email</h2>

        {email && (
          <p className={styles.instruction}>
            We just sent a confirmation code to <strong>{email}</strong>.
            <br />
            Please enter the code below to activate your account.
          </p>
        )}

        <form className={styles.loginForm} onSubmit={handleConfirm}>
          <div className={styles.formGroup}>
            <label htmlFor="code" className={styles.label}>
              Confirmation Code
            </label>
            <input
              type="text"
              id="code"
              className={styles.inputField}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>❌ {errorMsg}</p>}
          {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

          <button type="submit" className={styles.submitBtn}>
            Confirm and Sign In
          </button>
        </form>

        <p className={styles.noAccount}>
          Didn’t get the code?{" "}
          <button className={styles.resendLink} onClick={handleResendCode}>
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
