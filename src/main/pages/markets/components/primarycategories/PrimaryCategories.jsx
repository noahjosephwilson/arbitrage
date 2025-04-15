"use client";
import React from 'react';
import styles from './PrimaryCategories.module.css';

const PrimaryCategories = ({ categories = [], activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.primaryCategories}>
      <div className={styles.primaryCategoriesContent}>
        <div className={styles.topRow}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.topRowItem} ${activeCategory === category ? styles.activeCategory : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={styles.fullWidthLine}></div>
      </div>
    </div>
  );
};

export default PrimaryCategories;
