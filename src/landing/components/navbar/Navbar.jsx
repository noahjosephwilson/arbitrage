"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <nav className={styles.navbar}>
      {/* Left Section: Logo */}
      <div className={styles.leftSection}>
        <Link href="/landing/landingmarkets/all">
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
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <AiOutlineClose 
              className={styles.clearIcon}
              onClick={handleClear}
            />
          )}

          {isSearchFocused && (
            <div className={styles.searchBarStack}>
              {/* Example Search Cards */}
              <div className={styles.searchBarCard}>
                <img
                  src="https://via.placeholder.com/50"
                  alt=""
                  className={styles.searchCardImage}
                />
                <div className={styles.searchCardText}>Sample Result 1</div>
                <div className={styles.searchCardNumber}>10%</div>
              </div>
              <div className={styles.searchBarCard}>
                <img
                  src="https://via.placeholder.com/50"
                  alt=""
                  className={styles.searchCardImage}
                />
                <div className={styles.searchCardText}>Sample Result 2</div>
                <div className={styles.searchCardNumber}>20%</div>
              </div>
              <div className={styles.searchBarCard}>
                <img
                  src="https://via.placeholder.com/50"
                  alt=""
                  className={styles.searchCardImage}
                />
                <div className={styles.searchCardText}>Sample Result 3</div>
                <div className={styles.searchCardNumber}>30%</div>
              </div>
            </div>
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
    </nav>
  );
};

export default Navbar;
