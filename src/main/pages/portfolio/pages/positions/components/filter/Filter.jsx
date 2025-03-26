"use client"; // If you're using Next.js 13 with the app router

import React from "react";
import styles from "./Filter.module.css";

/**
 * A filter component with:
 * - A search box
 * - A set of buttons (toggle/view switch, filter dropdown, etc.)
 * - A secondary row of dropdown links
 */
const Filter = () => {
  return (
    <div className={styles.filterContainer}>
      {/* Top Row */}
      <div className={styles.topRow}>
        {/* Search Box */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}></span>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>

        {/* Right-side Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.iconButton}>
            {/* Using '=' as a placeholder icon; replace with your own icon as needed */}
            <span className={styles.menuIcon}>=</span>
          </button>
          <button className={styles.filterButton}>CurrentValue</button>
          <button className={styles.filterButton}>All ▾</button>
          <button className={styles.iconButton}>⋯</button>
        </div>
      </div>

      {/* Bottom Row (Dropdown-like links) */}
      <div className={styles.bottomRow}>
        <button className={styles.linkButton}>MARKET ▾</button>
        <button className={styles.linkButton}>LATEST ▾</button>
        <button className={styles.linkButton}>CURRENT ▾</button>
        <button className={styles.linkButton}>TO WIN ▾</button>
      </div>
    </div>
  );
};

export default Filter;
