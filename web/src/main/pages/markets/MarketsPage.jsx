"use client";
import React, { useState, useEffect } from "react";
import PrimaryCategories from "./components/primarycategories/PrimaryCategories";
import SecondaryCategories from "./components/secondarycategories/SecondaryCategories";
import CardStack from "./components/cardstack/CardStack";
import styles from "./MarketsPage.module.css";

// API endpoint to fetch categories.
const CATEGORIES_API_URL =
  "https://lxqyajwdrd.execute-api.us-east-1.amazonaws.com/dev/readcategories";

function MarketsPage() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use the entire category objects so we can extract IDs in CardStack.
  const [activePrimary, setActivePrimary] = useState(null);
  const [activeSecondary, setActiveSecondary] = useState(null);

  // Fetch categories when the component mounts.
  useEffect(() => {
    fetch(CATEGORIES_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Categories API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const fetchedCategories = data["Primary Categories"] || [];
        setCategoriesData(fetchedCategories);
        if (fetchedCategories.length > 0) {
          // Prefer "All" if it exists, otherwise default to the first category.
          const defaultPrimary =
            fetchedCategories.find((cat) => cat["Primary Name"] === "All") ||
            fetchedCategories[0];
          setActivePrimary(defaultPrimary);
          if (
            defaultPrimary["Secondary Categories"] &&
            defaultPrimary["Secondary Categories"].length > 0
          ) {
            setActiveSecondary(defaultPrimary["Secondary Categories"][0]);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle when the primary category changes.
  const handlePrimaryChange = (selectedCategory) => {
    console.log("Primary category changed to:", selectedCategory);
    setActivePrimary(selectedCategory);
    if (
      selectedCategory["Secondary Categories"] &&
      selectedCategory["Secondary Categories"].length > 0
    ) {
      setActiveSecondary(selectedCategory["Secondary Categories"][0]);
    } else {
      setActiveSecondary(null);
    }
  };

  // Handle when the secondary category changes.
  const handleSecondaryChange = (selectedSubcategory) => {
    console.log("Secondary category changed to:", selectedSubcategory);
    setActiveSecondary(selectedSubcategory);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading categories...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  const secondaryOptions =
    activePrimary && activePrimary["Secondary Categories"]
      ? activePrimary["Secondary Categories"]
      : [];

  return (
    <div className={styles.container}>
      <PrimaryCategories
        categories={categoriesData}
        activeCategory={activePrimary}
        onCategoryChange={handlePrimaryChange}
      />
      <SecondaryCategories
        subcategories={secondaryOptions}
        activeSubcategory={activeSecondary}
        onSubcategoryChange={handleSecondaryChange}
      />
      <CardStack
        activePrimary={activePrimary}
        secondaryCategoryOptions={secondaryOptions}
        activeSubcategory={activeSecondary}
        onSubcategoryChange={handleSecondaryChange}
      />
    </div>
  );
}

export default MarketsPage;
