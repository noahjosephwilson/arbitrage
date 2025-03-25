"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from "@/firebaseConfig"; // adjust the path as needed
import { signOut } from "firebase/auth";
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    setSearchValue('');
  };

  const handleMarketsClick = (e) => {
    // If already on a markets page, redirect to the "All" tab
    if (pathname.startsWith('/main/markets')) {
      e.preventDefault();
      router.push('/main/markets/all');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally redirect after logout
      router.push('/landing/landingmarkets/all');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* Left Section: Logo and Navigation Links */}
      <div className={styles.leftSection}>
        <Link href="/main/logo">
          <span className={styles.logo}>Arbitrage</span>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/main/markets/all" onClick={handleMarketsClick}>
              Markets
            </Link>
          </li>
          <li>
            <Link href="/main/portfolio">Portfolio</Link>
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
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
