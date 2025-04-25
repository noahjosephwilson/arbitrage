"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, confirmSignIn, signOut, SignInOutput } from "aws-amplify/auth";
import styles from "./NewPasswordPage.module.css";

const NewPasswordPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<SignInOutput | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const email = url.get("email");
    const tempPassword = url.get("tempPassword");

    if (!email || !tempPassword) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const result = await signIn({ username: email, password: tempPassword });

        if (result.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
          setUser(result);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Temp sign-in failed:", err);
        router.push("/login");
      }
    })();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
        await confirmSignIn({
            challengeResponse: newPassword
          });
          
      router.push("/admin/markets");
    } catch (err: any) {
      console.error("New password error:", err);
      setErrorMsg(err.message || "Failed to set new password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ global: true });
      router.push("/registration/login");
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Set New Password</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Log Out
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className={styles.inputField}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.inputField}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage; 