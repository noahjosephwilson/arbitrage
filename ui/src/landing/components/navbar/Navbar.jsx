"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleClear = () => setSearchValue('');

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>

        {/* Left Section: Static Logo */}
        <div className={styles.leftSection}>
          <span className={styles.logoStatic}>
            Arbitrage
          </span>
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
            <button
              className={styles.loginBtn}
              onClick={() => router.push('/registration/login')}
            >
              Log in
            </button>
            <button
              className={styles.signupBtn}
              onClick={() => router.push('/registration/signup')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
