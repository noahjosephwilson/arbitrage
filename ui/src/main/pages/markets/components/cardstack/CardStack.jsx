// components/cardstack/CardStack.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Card from "@/main/pages/markets/components/cardstack/components/card/Card";
import styles from "./CardStack.module.css";

/* ─────────── API endpoints ─────────── */
const MARKET_IDS_API_URL =
  "https://z5uhj1qanf.execute-api.us-east-1.amazonaws.com/dev/readmarketids";
const MARKET_DETAILS_API_URL =
  "https://d9pdiud471.execute-api.us-east-1.amazonaws.com/dev/marketcarddetails";

/* helper to turn a market record → card props */
const marketToCard = (mk) => {
  const opt    = mk.options[0] ?? {};
  const yesPct = Math.round((opt.choice1Value ?? 0) * 100);
  const noPct  = Math.round((opt.choice2Value ?? 0) * 100);

  return {
    marketID:    mk.marketID,
    imageSrc:    mk.imageUrl || "https://via.placeholder.com/50",
    title:       mk.name,
    totalAmount: mk.volume,
    items: [
      { name: opt.choice1 ?? "Yes", percentage: yesPct },
      { name: opt.choice2 ?? "No",  percentage: noPct  },
    ],
    percentage: yesPct,
    yesInfo:   `$100 → $${(yesPct * 2.78).toFixed(2)}`,
    noInfo:    `$100 → $${(noPct  * 1.45).toFixed(2)}`,
  };
};

export default function CardStack({
  activePrimary,
  secondaryCategoryOptions = [],
  activeSubcategory,
  onSubcategoryChange,
}) {
  const [marketIDs,    setMarketIDs]    = useState([]);
  const [cardsData,    setCardsData]    = useState([]);
  const [marketsError, setMarketsError] = useState(null);

  const CHUNK_SIZE    = 12;
  const [visibleCards, setVisibleCards] = useState([]);
  const [itemsToShow,  setItemsToShow]  = useState(CHUNK_SIZE);
  const sentinelRef   = useRef(null);

  /* 1 ─ fetch market IDs */
  useEffect(() => {
    if (!activePrimary?.["Primary ID"] || !activeSubcategory?.["Secondary ID"])
      return;

    const url = `${MARKET_IDS_API_URL}?primaryID=${encodeURIComponent(
      activePrimary["Primary ID"]
    )}&secondaryID=${encodeURIComponent(activeSubcategory["Secondary ID"])}`;

    setMarketsError(null);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ marketIDs = [] }) => {
        setMarketIDs(marketIDs);
        // placeholder cards while loading details
        setCardsData(
          marketIDs.map((id) => ({
            marketID:    id,
            title:       "Loading…",
            imageSrc:    "https://via.placeholder.com/50",
            totalAmount: 0,
            items:       [],
          }))
        );
      })
      .catch((e) => {
        setMarketsError(e.message);
        setMarketIDs([]);
        setCardsData([]);
      })
      .finally(() => {
        setItemsToShow(CHUNK_SIZE);
      });
  }, [activePrimary, activeSubcategory]);

  /* 2 ─ fetch market details and build cardsData */
  useEffect(() => {
    if (!marketIDs.length) return;

    fetch(MARKET_DETAILS_API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ body: { marketIDs } }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ markets = [] }) => {
        setCardsData(markets.map(marketToCard));
      })
      .catch((e) => {
        setMarketsError(e.message);
      });
  }, [marketIDs]);

  /* 3 ─ paginate */
  useEffect(() => {
    setVisibleCards(cardsData.slice(0, itemsToShow));
  }, [cardsData, itemsToShow]);

  /* 4 ─ infinite scroll */
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && itemsToShow < cardsData.length) {
        setItemsToShow((n) => n + CHUNK_SIZE);
      }
    });
    if (sentinelRef.current) io.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) io.unobserve(sentinelRef.current);
    };
  }, [itemsToShow, cardsData]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        {marketsError && <p className={styles.error}>Error: {marketsError}</p>}

        <div className={styles.itemsGrid}>
          {visibleCards.map((card) => (
            <Card key={card.marketID} {...card} />
          ))}
        </div>

        <div ref={sentinelRef} className={styles.sentinel} />
      </div>
    </section>
  );
}
