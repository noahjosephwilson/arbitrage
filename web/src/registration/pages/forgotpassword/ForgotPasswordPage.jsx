"use client";
import React from 'react';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <a href="/registration/login" className={styles.backButton}>
          &larr; Back
        </a>
        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.description}>
          Enter your email address below to receive a code to reset your password.
        </p>
        <form className={styles.forgotPasswordForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.inputField}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
