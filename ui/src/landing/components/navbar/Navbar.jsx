"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left Section: Logo */}
        <div className={styles.leftSection}>
          <Link href="/landing">
            <span className={styles.logo}>Arbitrage</span>
          </Link>
        </div>

        {/* Right Section: Search and Auth Buttons */}
        <div className={styles.rightSection}>
          <div className={styles.searchContainer}>
            <AiOutlineSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search markets"
              className={styles.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <AiOutlineClose 
                className={styles.clearIcon}
                onClick={handleClear}
              />
            )}
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
      </div>
    </nav>
  );
};

export default Navbar;
