"use client";
import React, { useState, useEffect } from 'react';
import styles from './SecondaryCategories.module.css';

const SecondaryCategories = ({ subcategories, defaultActive, onSubcategoryChange }) => {
  const [activeSubcategory, setActiveSubcategory] = useState(defaultActive || subcategories[0]);

  // Sync with external default value when it changes.
  useEffect(() => {
    setActiveSubcategory(defaultActive);
  }, [defaultActive]);

  const handleSubcategoryClick = (subcat) => {
    setActiveSubcategory(subcat);
    if (onSubcategoryChange) {
      onSubcategoryChange(subcat);
    }
  };

  return (
    <div className={styles.secondaryCategories}>
      <div className={styles.secondaryCategoriesContent}>
        <div className={styles.subcategoryList}>
          {subcategories.map((subcat) => (
            <button
              key={subcat}
              className={`${styles.subcategoryItem} ${
                activeSubcategory === subcat ? styles.activeSubcategory : ''
              }`}
              onClick={() => handleSubcategoryClick(subcat)}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryCategories;
