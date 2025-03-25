"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from "@/firebaseConfig"; // adjust the path as needed
import { signOut } from "firebase/auth";
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleMarketsClick = (e) => {
    // If the current route is any markets page, redirect to the "All" tab
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
      {/* Left Section: Logo and Nav Links */}
      <div className={styles.leftSection}>
        <Link href="/main/logo">
          <span className={styles.logo}>Arbitrage</span>
        </Link>
        <ul className={`${styles.navLinks} ${isMobileNavOpen ? styles.active : ''}`}>
          <li>
            <Link href="/main/markets/all" onClick={handleMarketsClick}>
              Markets
            </Link>
          </li>
          <li>
            <Link href="/main/portfolio">Portfolio</Link>
          </li>
          {/* Removed the Live button */}
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
          {/* Logout button added */}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
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
