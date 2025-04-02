"use client";
import React, { useState } from 'react';
import styles from './Subcategories.module.css';

const Subcategories = ({ subcategories, defaultActive }) => {
  const [activeSubcategory, setActiveSubcategory] = useState(
    defaultActive || (subcategories && subcategories[0])
  );

  const handleSubcategoryClick = (subcat) => {
    setActiveSubcategory(subcat);
  };

  return (
    <div className={styles.subcategories}>
      <div className={styles.subcategoriesContent}>
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

export default Subcategories;
