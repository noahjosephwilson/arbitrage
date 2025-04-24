import React from 'react';
import styles from './Filter.module.css';

const Filter = () => {
  return (
    <div className={styles.filterContainer}>
      {/* Left Section: Search */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
        />
      </div>

      {/* Middle Section: Dropdown + Filter Tabs */}
      <div className={styles.filters}>
        <div className={styles.dropdownContainer}>
          <button className={styles.dropdownButton}>
            Market
            <span className={styles.arrowDown}>▼</span>
          </button>
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem}>LATEST</button>
            <button className={styles.dropdownItem}>BET</button>
            <button className={styles.dropdownItem}>CURRENT</button>
            <button className={styles.dropdownItem}>TO WIN</button>
          </div>
        </div>
        {/* If you'd like the items to be visible instead of a dropdown, 
            you can replace the above with a set of visible buttons. */}
      </div>

      {/* Right Section: Additional Buttons (ALL, ... ) */}
      <div className={styles.actionButtons}>
        <button className={styles.filterButton}>ALL</button>
        <button className={styles.filterButton}>…</button>
      </div>
    </div>
  );
};

export default Filter;
