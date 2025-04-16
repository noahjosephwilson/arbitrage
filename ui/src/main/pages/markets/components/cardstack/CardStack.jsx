"use client";
import React, { useState, useEffect, useRef } from "react";
import Card from "@/main/pages/markets/components/cardstack/components/card/Card";
import SecondaryCategories from "@/main/pages/markets/components/secondarycategories/SecondaryCategories";
import styles from "./CardStack.module.css";

/* ─────────── API endpoints ─────────── */
const MARKET_IDS_API_URL =
  "https://z5uhj1qanf.execute-api.us-east-1.amazonaws.com/dev/readmarketids";
const MARKET_DETAILS_API_URL =
  "https://d9pdiud471.execute-api.us-east-1.amazonaws.com/dev/marketcarddetails";

/* helper to turn a market record → card props */
const marketToCard = (mk) => {
  const opt   = mk.options[0] ?? {};
  const yesPct = Math.round((opt.choice1Value ?? 0) * 100);
  const noPct  = Math.round((opt.choice2Value ?? 0) * 100);

  return {
    marketID: mk.marketID,
    imageSrc: "https://via.placeholder.com/50",          // TODO: replace with real image
    title:    mk.name,
    totalAmount: mk.volume,
    items: [
      { name: opt.choice1 ?? "Yes", percentage: yesPct },
      { name: opt.choice2 ?? "No",  percentage: noPct  },
    ],
    percentage: yesPct,
    yesInfo: `$100 → $${(yesPct * 2.78).toFixed(2)}`,
    noInfo:  `$100 → $${(noPct  * 1.45).toFixed(2)}`,
  };
};

export default function CardStack({
  activePrimary,
  secondaryCategoryOptions = [],
  activeSubcategory,
  onSubcategoryChange,
}) {
  const [marketIDs,  setMarketIDs]  = useState([]);
  const [cardsData,  setCardsData]  = useState([]);

  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [marketsError,   setMarketsError]   = useState(null);

  const [detailsOutput,  setDetailsOutput]  = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError,   setDetailsError]   = useState(null);

  const CHUNK_SIZE   = 12;
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

    setLoadingMarkets(true);
    setMarketsError(null);

    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(({ marketIDs = [] }) => {
        setMarketIDs(marketIDs);

        /* placeholders so grid doesn't flash empty */
        setCardsData(
          marketIDs.map((id) => ({
            marketID: id,
            title: "Loading…",
            imageSrc: "https://via.placeholder.com/50",
            totalAmount: 0,
            items: [],
          }))
        );
      })
      .catch((e) => {
        setMarketsError(e.message);
        setMarketIDs([]);
        setCardsData([]);
      })
      .finally(() => {
        setLoadingMarkets(false);
        setItemsToShow(CHUNK_SIZE);
      });
  }, [activePrimary, activeSubcategory]);

  /* 2 ─ fetch market details */
  useEffect(() => {
    if (!marketIDs.length) { setDetailsOutput(null); return; }

    setLoadingDetails(true);
    setDetailsError(null);

    fetch(MARKET_DETAILS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: { marketIDs } }),
    })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setDetailsOutput)
      .catch((e) => {
        setDetailsError(e.message);
        setDetailsOutput(null);
      })
      .finally(() => setLoadingDetails(false));
  }, [marketIDs]);

  /* 3 ─ build cards from details */
  useEffect(() => {
    if (!detailsOutput?.markets) return;
    setCardsData(detailsOutput.markets.map(marketToCard));
  }, [detailsOutput]);

  /* 4 ─ paginate */
  useEffect(() => {
    setVisibleCards(cardsData.slice(0, itemsToShow));
  }, [cardsData, itemsToShow]);

  /* 5 ─ infinite scroll */
  useEffect(() => {
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting && itemsToShow < cardsData.length) {
        setItemsToShow((n) => n + CHUNK_SIZE);
      }
    });
    sentinelRef.current && io.observe(sentinelRef.current);
    return () => sentinelRef.current && io.unobserve(sentinelRef.current);
  }, [itemsToShow, cardsData]);

  /* ─────────── render ─────────── */
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <SecondaryCategories
          subcategories={secondaryCategoryOptions}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={onSubcategoryChange}
        />

        {loadingMarkets && <p>Loading markets…</p>}
        {marketsError && <p className={styles.error}>Error: {marketsError}</p>}

        <div className={styles.itemsGrid}>
          {visibleCards.map((card) => (
            <Card key={card.marketID} {...card} />
          ))}
        </div>

        <div ref={sentinelRef} className={styles.sentinel} />

        {/* ─────────── debug ─────────── */}
        <div className={styles.debugSection}>
          <h3>Debug Info</h3>
          <p><strong>Market IDs sent:</strong></p>
          <pre>{JSON.stringify({ body: { marketIDs } }, null, 2)}</pre>
          <p><strong>Details API status:</strong>{" "}
            {loadingDetails ? "Loading…" : detailsError ? `Error: ${detailsError}` : "OK"}</p>
          <pre>{JSON.stringify(detailsOutput, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
