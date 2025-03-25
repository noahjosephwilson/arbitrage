"use client";
import React from 'react';
import { FaGoogle, FaApple, FaPaypal } from 'react-icons/fa';
import styles from './LoginPage.module.css';

const LoginPage = () => {
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
        <form className={styles.loginForm}>
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
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Log In
          </button>
        </form>
        <div className={styles.dividerContainer}>
          <div className={styles.divider}></div>
          <span className={styles.dividerText}>or log in with</span>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.socialContainer}>
          <button className={`${styles.socialBtn} ${styles.googleBtn}`}>
            <FaGoogle className={styles.socialIcon} />
            Google
          </button>
          <button className={`${styles.socialBtn} ${styles.appleBtn}`}>
            <FaApple className={styles.socialIcon} />
            Apple
          </button>
          <button className={`${styles.socialBtn} ${styles.paypalBtn}`}>
            <FaPaypal className={styles.socialIcon} />
            PayPal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
