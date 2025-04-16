"use client";
import React from "react";
import styles from "./PrimaryCategories.module.css";

const PrimaryCategories = ({ categories = [], activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.primaryCategories}>
      <div className={styles.primaryCategoriesContent}>
        <div className={styles.topRow}>
          {categories.map((category, idx) => (
            <button
              key={category["Primary ID"] || category["Primary Name"] || idx}
              className={`${styles.topRowItem} ${
                activeCategory &&
                activeCategory["Primary ID"] === category["Primary ID"]
                  ? styles.activeCategory
                  : ""
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category["Primary Name"]}
            </button>
          ))}
        </div>
        <div className={styles.fullWidthLine}></div>
      </div>
    </div>
  );
};

export default PrimaryCategories;
