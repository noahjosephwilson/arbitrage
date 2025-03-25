"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <nav className={styles.navbar}>
      {/* Left Section: Logo and Nav Links */}
      <div className={styles.leftSection}>
        <Link href="/main/markets/all">
          <span className={styles.logo}>Arbitrage</span>
        </Link>
        <ul className={`${styles.navLinks} ${isMobileNavOpen ? styles.active : ''}`}>
          <li>
            <Link href="/main/markets/all">Markets</Link>
          </li>
          <li>
            <Link href="/main/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link href="/main/live">Live</Link>
          </li>
          <li>
            <Link href="/main/create">Create</Link>
          </li>
        </ul>
      </div>

      {/* Right Section: Search and Auth Buttons */}
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search members or profiles"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.authButtons}>
          <Link href="/registration/login">
            <button className={styles.loginBtn}>Log in</button>
          </Link>
          <Link href="/registration/signup">
            <button className={styles.signupBtn}>Sign up</button>
          </Link>
        </div>
      </div>

      {/* Hamburger Menu (visible on mobile) */}
      <button
        className={styles.mobileToggle}
        onClick={handleToggle}
        aria-label="Toggle navigation"
      >
        {isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>
    </nav>
  );
};

export default Navbar;
