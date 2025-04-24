"use client";
import React from "react";
import styles from "./SecondaryCategories.module.css";

const SecondaryCategories = ({ subcategories = [], activeSubcategory, onSubcategoryChange, animate }) => {
  return (
    <div className={styles.secondaryCategories}>
      <div className={styles.secondaryCategoriesContent}>
        <div className={styles.subcategoryList}>
          {subcategories.map((subcat, idx) => (
            <button
              key={subcat["Secondary ID"] || subcat["Secondary Name"] || idx}
              className={`${styles.subcategoryItem} ${
                activeSubcategory &&
                activeSubcategory["Secondary ID"] === subcat["Secondary ID"]
                  ? // Only add the animate class if the animate prop is true.
                    `${styles.activeSubcategory} ${animate ? styles.animate : ""}`
                  : ""
              }`}
              onClick={() => onSubcategoryChange(subcat)}
            >
              {subcat["Secondary Name"]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryCategories;
