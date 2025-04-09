"use client";

import React from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar = ({ profileImageUrl }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarketsClick = (e) => {
    if (pathname.startsWith('/main/markets')) {
      e.preventDefault();
      router.push('/main/markets/all');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Left Section: Logo and Navigation Links */}
        <div className={styles.leftSection}>
          {/* Removed Link so Logo is not clickable */}
          <span className={styles.logo}>Arbitrage</span>
          <div className={styles.navLinks}>
            <ul>
              <li>
                <Link href="/admin/markets" onClick={handleMarketsClick}>
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/users">Users</Link>
              </li>
              <li>
                <Link href="/analytics">Analytics</Link>
              </li>
              <li>
                <Link href="/analytics">History</Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Right Section: Profile Image/Icon */}
        <div className={styles.rightSection}>
          <div className={styles.iconButton}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
            ) : (
              <FaUserCircle className={styles.profileIcon} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
