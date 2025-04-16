"use client";
import React, { useState, useEffect, useRef } from "react";
import Card from "@/main/pages/markets/components/cardstack/components/card/Card";
import SecondaryCategories from "@/main/pages/markets/components/secondarycategories/SecondaryCategories";
import styles from "./CardStack.module.css";

// API endpoint to fetch MarketIDs given a primary and secondary category combination.
const MARKET_IDS_API_URL =
  "https://z5uhj1qanf.execute-api.us-east-1.amazonaws.com/dev/readmarketids";

function CardStack({
  activePrimary, // full primary category object (with Primary ID)
  secondaryCategoryOptions = [],
  activeSubcategory, // secondary category object (with Secondary ID)
  onSubcategoryChange,
}) {
  // State for market IDs and dynamic card data (market details).
  const [marketIDs, setMarketIDs] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [marketsError, setMarketsError] = useState(null);

  // For paginated (chunked) display of cards.
  const CHUNK_SIZE = 12;
  const [visibleCards, setVisibleCards] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(CHUNK_SIZE);
  const sentinelRef = useRef(null);

  // Fetch the list of MarketIDs when activePrimary and activeSubcategory are set.
  useEffect(() => {
    if (activePrimary?.["Primary ID"] && activeSubcategory?.["Secondary ID"]) {
      setLoadingMarkets(true);
      const primaryID = activePrimary["Primary ID"];
      const secondaryID = activeSubcategory["Secondary ID"];
      const url = `${MARKET_IDS_API_URL}?primaryID=${encodeURIComponent(
        primaryID
      )}&secondaryID=${encodeURIComponent(secondaryID)}`;

      fetch(url)
        .then((response) => {
          console.log("Received response with status:", response.status);
          if (!response.ok) {
            throw new Error(`MarketIDs API error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("MarketIDs API returned data:", data);
          setMarketIDs(data.marketIDs || []);

          // Simulate a mapping from each market ID to its market details.
          // (Replace this with a fetch to your second DynamoDB table as needed.)
          const dynamicCardsData = (data.marketIDs || []).map((id) => ({
            marketID: id,
            title: `Market ${id}`,
            imageSrc: "https://via.placeholder.com/50",
            // For demo purposes, randomize a total amount.
            totalAmount: Math.floor(Math.random() * 100000),
            // And randomize outcomes for Yes/No.
            items: [
              { name: "Yes", percentage: Math.floor(Math.random() * 100) },
              { name: "No", percentage: Math.floor(Math.random() * 100) },
            ],
          }));
          setCardsData(dynamicCardsData);
        })
        .catch((err) => {
          console.error("Error fetching MarketIDs:", err);
          setMarketIDs([]);
          setMarketsError(err.message);
        })
        .finally(() => {
          setLoadingMarkets(false);
          // Reset the number of items for chunked display.
          setItemsToShow(CHUNK_SIZE);
        });
    }
  }, [activePrimary, activeSubcategory]);

  // Update the visible cards whenever the full cardsData or itemsToShow changes.
  useEffect(() => {
    setVisibleCards(cardsData.slice(0, itemsToShow));
  }, [cardsData, itemsToShow]);

  // Set up an Intersection Observer to load more cards when needed.
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Load more if the sentinel element is in view and there are more cards.
      if (entries[0].isIntersecting && itemsToShow < cardsData.length) {
        setItemsToShow((prev) => prev + CHUNK_SIZE);
      }
    });
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [itemsToShow, cardsData]);

  return (
    <div className={styles.container}>
      {/* The SecondaryCategories component remains the same. */}
      <SecondaryCategories
        subcategories={secondaryCategoryOptions}
        activeSubcategory={activeSubcategory}
        onSubcategoryChange={onSubcategoryChange}
      />

      {/* Show loading or error messages when fetching market IDs. */}
      {loadingMarkets && <p>Loading markets...</p>}
      {marketsError && <p>Error: {marketsError}</p>}

      {/* Display the dynamic market cards in a grid. */}
      <div className={styles.itemsGrid}>
        {visibleCards.map((card, index) => {
          const isYesNo =
            card.items.length === 2 &&
            card.items.some((item) => item.name.toLowerCase() === "yes") &&
            card.items.some((item) => item.name.toLowerCase() === "no");

          if (isYesNo || card.items.length === 1) {
            let yesItem, noItem;
            if (isYesNo) {
              yesItem = card.items.find(
                (item) => item.name.toLowerCase() === "yes"
              );
              noItem = card.items.find(
                (item) => item.name.toLowerCase() === "no"
              );
            } else {
              yesItem = card.items[0];
              noItem = undefined;
            }
            return (
              <Card
                key={card.marketID || index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                percentage={yesItem.percentage}
                yesInfo={`$100 → $${(yesItem.percentage * 2.78).toFixed(2)}`}
                noInfo={
                  noItem
                    ? `$100 → $${(noItem.percentage * 1.45).toFixed(2)}`
                    : ""
                }
              />
            );
          } else {
            // Render the Card for markets with multiple items.
            return (
              <Card
                key={card.marketID || index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                items={card.items}
              />
            );
          }
        })}
      </div>

      {/* Sentinel element to trigger infinite scroll/loading more cards. */}
      <div ref={sentinelRef} className={styles.sentinel}></div>
    </div>
  );
}

export default CardStack;
