"use client";
import React, { useState } from "react";
import Card from "@/main/pages/markets/components/cardstack/components/card/Card";
import SecondaryCategories from "@/main/pages/markets/components/secondarycategories/SecondaryCategories";
import styles from "./CardStack.module.css";

function CardStack({ primaryCategory, secondaryCategoryOptions, sampleCards }) {
  // Maintain a local active secondary state.
  const [activeSecondary, setActiveSecondary] = useState(secondaryCategoryOptions[0] || "");

  // Instead of fetching, we use the sampleCards prop for now.
  const cards = sampleCards;

  return (
    <div className={styles.container}>
      {/* Secondary categories control */}
      <SecondaryCategories
        subcategories={secondaryCategoryOptions}
        defaultActive={activeSecondary}
        onSubcategoryChange={setActiveSecondary}
      />

      {/* Display cards in a grid */}
      <div className={styles.itemsGrid}>
        {cards.map((card, index) => {
          const isYesNo =
            card.items.length === 2 &&
            card.items.some((item) => item.name.toLowerCase() === "yes") &&
            card.items.some((item) => item.name.toLowerCase() === "no");

          if (isYesNo || card.items.length === 1) {
            let yesItem, noItem;
            if (isYesNo) {
              yesItem = card.items.find((item) => item.name.toLowerCase() === "yes");
              noItem = card.items.find((item) => item.name.toLowerCase() === "no");
            } else {
              yesItem = card.items[0];
              noItem = undefined;
            }
            return (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                percentage={yesItem.percentage}
                yesInfo={`$100 → $${(yesItem.percentage * 2.78).toFixed(2)}`}
                noInfo={noItem ? `$100 → $${(noItem.percentage * 1.45).toFixed(2)}` : ""}
              />
            );
          } else {
            // Render a Card with multiple items
            return (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                items={card.items}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default CardStack;
