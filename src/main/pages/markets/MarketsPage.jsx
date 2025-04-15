"use client";
import React, { useState } from "react";
import PrimaryCategories from "./components/primarycategories/PrimaryCategories";
import SecondaryCategories from "./components/secondarycategories/SecondaryCategories";
import CardStack from "./components/cardstack/CardStack";
import styles from "./MarketsPage.module.css";

// Define the primary categories (data names are clearly "primary categories")
const primaryCategories = [
  "All",
  "Politics",
  "Sports",
  "Culture",
  "Crypto",
  "Climate",
  "Economics",
  "Companies",
  "Financials",
  "Tech",
  "Health",
  "World",
];

// Map primary categories to their respective secondary categories.
const secondaryCategoriesMapping = {
  All: ["Trending", "Latest", "Popular"],
  Politics: ["Elections", "Policy", "Government"],
  Sports: ["Football", "Basketball", "Tennis"],
  Culture: ["Art", "Music", "Film"],
  Crypto: ["Bitcoin", "Ethereum", "Altcoins"],
  Climate: ["Global Warming", "Renewable Energy"],
  Economics: ["Macroeconomics", "Microeconomics"],
  Companies: ["Startups", "Multinationals"],
  Financials: ["Banking", "Investing"],
  Tech: ["Gadgets", "Innovations"],
  Health: ["Wellness", "Medical Research"],
  World: ["Diplomacy", "International News"],
};

// Define sample card data that includes both primary and secondary category fields.
const sampleCardsData = [
  {
    primaryCategory: "Politics",
    secondaryCategory: "Elections",
    imageSrc: "https://via.placeholder.com/50",
    title: "Election Forecast",
    totalAmount: 123456,
    items: [
      { name: "Yes", percentage: 65 },
      { name: "No", percentage: 35 },
    ],
  },
  {
    primaryCategory: "Sports",
    secondaryCategory: "Football",
    imageSrc: "https://via.placeholder.com/50",
    title: "Football Game Review",
    totalAmount: 78910,
    items: [
      { name: "Football", percentage: 50 },
      { name: "Basketball", percentage: 30 },
      { name: "Tennis", percentage: 20 },
    ],
  },
  {
    primaryCategory: "Culture",
    secondaryCategory: "Film",
    imageSrc: "https://via.placeholder.com/50",
    title: "Film Festival Highlights",
    totalAmount: 112233,
    items: [
      { name: "Yes", percentage: 80 },
    ],
  },
  {
    primaryCategory: "All",
    secondaryCategory: "Trending",
    imageSrc: "https://via.placeholder.com/50",
    title: "Global Market Trends",
    totalAmount: 445566,
    items: [
      { name: "Yes", percentage: 70 },
      { name: "No", percentage: 30 },
    ],
  },
];

function MarketsPage() {
  // Initialize activePrimary with the first item, and similarly for activeSecondary.
  const [activePrimary, setActivePrimary] = useState(primaryCategories[0]);
  const initialSecondary = secondaryCategoriesMapping[primaryCategories[0]]?.[0] || "";
  const [activeSecondary, setActiveSecondary] = useState(initialSecondary);

  // When a primary category changes, update it and set the secondary accordingly.
  const handlePrimaryChange = (selectedCategory) => {
    setActivePrimary(selectedCategory);
    const newSecondary = secondaryCategoriesMapping[selectedCategory]?.[0] || "";
    setActiveSecondary(newSecondary);
  };

  // Filter the sample card data based on the selected primary and secondary categories.
  // For the "All" primary category, we simply filter by secondary category.
  const filteredCards =
    activePrimary === "All"
      ? sampleCardsData.filter(
          (card) => card.secondaryCategory === activeSecondary
        )
      : sampleCardsData.filter(
          (card) =>
            card.primaryCategory === activePrimary &&
            card.secondaryCategory === activeSecondary
        );

  // Get the secondary options for the active primary category.
  const secondaryOptions = secondaryCategoriesMapping[activePrimary] || [];

  return (
    <div className={styles.container}>
      {/* Primary Category Selection */}
      <PrimaryCategories
        categories={primaryCategories}
        activeCategory={activePrimary}
        onCategoryChange={handlePrimaryChange}
      />

      {/* Secondary Category Selection */}
      <SecondaryCategories
        subcategories={secondaryOptions}
        defaultActive={activeSecondary}
        onSubcategoryChange={setActiveSecondary}
      />

      {/* CardStack displays cards that match the current primary/secondary selections */}
      <CardStack
        primaryCategory={activePrimary}
        secondaryCategoryOptions={secondaryOptions}
        sampleCards={filteredCards}
      />
    </div>
  );
}

export default MarketsPage;
