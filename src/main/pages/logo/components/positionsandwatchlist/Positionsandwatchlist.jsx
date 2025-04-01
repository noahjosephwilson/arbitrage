"use client";
import React from "react";
import styles from "./Positionsandwatchlist.module.css";
import PositionsContract from "./positionscontract/PositionsContract";
import WatchlistContract from "./watchlistcontract/WatchlistContract"; // Adjust path if needed

// Dummy data for positions (updated with a longer contract name)
const positionsData = [
  { 
    contractName: "Will the Federal Reserve raise interest rates?", 
    contracts: 10, 
    position: "Yes", 
    price: 184.55, 
    change: 1.25,
    imageUrl: "path/to/image1.jpg"
  },
  { 
    contractName: "Is the new economic policy beneficial for growth in the long term?", 
    contracts: 5, 
    position: "No", 
    price: 150.25, 
    change: -0.50,
    imageUrl: "path/to/image2.jpg"
  },
  { 
    contractName: "A very long contract name that might need ellipsis because it exceeds the available space", 
    contracts: 3, 
    position: "Yes", 
    price: 2500.00, 
    change: 2.15,
    imageUrl: "path/to/image3.jpg"
  },
];

// Dummy data for watchlist (now including imageUrl and a long ticker name sample)
const watchlistData = [
  { ticker: "Is the new economic policy beneficial for growth in the long term?", price: 700.50, change: 3.50, imageUrl: "path/to/tsla.jpg" },
  { ticker: "Is the new economic policy beneficial for growth in the long term?", price: 500.00, change: -1.00, imageUrl: "path/to/nflx.jpg" },
  { ticker: "Is the new economic policy beneficial for growth in the long term?", price: 3300.00, change: 0.75, imageUrl: "path/to/amzn.jpg" },
  { ticker: "A VERY LONG TICKER NAME THAT SHOULD BE ELLIPSED", price: 250.00, change: 2.00, imageUrl: "path/to/longticker.jpg" },
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
              contractName={item.contractName}
              contracts={item.contracts}
              position={item.position}
              price={item.price}
              change={item.change}
              imageUrl={item.imageUrl}
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
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
