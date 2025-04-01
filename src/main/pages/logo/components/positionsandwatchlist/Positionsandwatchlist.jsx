"use client";
import React from "react";
import styles from "./Positionsandwatchlist.module.css";
import PositionsContract from "./positionscontract/PositionsContract"; // Adjust path if needed
import WatchlistContract from "./watchlistcontract/WatchlistContract"; // Adjust path if needed

// Dummy data for positions
const positionsData = [
  { ticker: "DMI", shares: 20, price: 184.55, change: 1.25 },
  { ticker: "AAPL", shares: 10, price: 150.25, change: -0.50 },
  { ticker: "GOOG", shares: 5, price: 2500.00, change: 2.15 },
];

// Dummy data for watchlist (no shares count needed)
const watchlistData = [
  { ticker: "TSLA", price: 700.50, change: 3.50 },
  { ticker: "NFLX", price: 500.00, change: -1.00 },
  { ticker: "AMZN", price: 3300.00, change: 0.75 },
];

export default function Positionsandwatchlist() {
  return (
    <div className={styles.container}>
      {/* Positions Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Positions</h2>
        <div className={styles.itemsList}>
          {positionsData.map((item, index) => (
            <PositionsContract
              key={`position-${index}`}
              ticker={item.ticker}
              shares={item.shares}
              price={item.price}
              change={item.change}
            />
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Watchlist</h2>
        <div className={styles.itemsList}>
          {watchlistData.map((item, index) => (
            <WatchlistContract
              key={`watchlist-${index}`}
              ticker={item.ticker}
              price={item.price}
              change={item.change}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
