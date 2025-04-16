"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className={styles.navbar}>
      <Link href="/main/portfolio/positions">
        <button
          className={`${styles.tabButton} ${
            pathname === "/main/portfolio/positions" ? styles.activeTab : ""
          }`}
        >
          Positions
        </button>
      </Link>
      <Link href="/main/portfolio/openorders">
        <button
          className={`${styles.tabButton} ${
            pathname === "/main/portfolio/openorders" ? styles.activeTab : ""
          }`}
        >
          Open Orders
        </button>
      </Link>
      <Link href="/main/portfolio/history">
        <button
          className={`${styles.tabButton} ${
            pathname === "/main/portfolio/history" ? styles.activeTab : ""
          }`}
        >
          History
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
