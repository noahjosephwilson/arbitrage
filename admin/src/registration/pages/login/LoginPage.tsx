"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, getCurrentUser, signOut, SignInOutput } from "aws-amplify/auth";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      // Sign out any existing session
      try {
        const existing = await getCurrentUser();
        if (existing) await signOut({ global: true });
      } catch {
        // No one was signed in
      }

      const user: SignInOutput = await signIn({ username: email, password });
      console.info("SignIn result:", user);

      const step = user?.nextStep?.signInStep;

      if (step === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        router.push(`/registration/newpassword?email=${encodeURIComponent(email)}&tempPassword=${encodeURIComponent(password)}`);
      } else if (step === "DONE" || user.isSignedIn) {
        router.push("/admin/markets");
      } else {
        setErrorMsg(`Unexpected sign-in step: ${step || "unknown"}. Please contact support.`);
        setLoading(false);
      }
      
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setErrorMsg(err.message || "Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage Admin</h1>
        </header>

        <h2 className={styles.title}>Log In</h2>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 