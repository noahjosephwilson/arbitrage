"use client";
import React from "react";
import styles from "./WatchlistContract.module.css";

/**
 * Example usage:
 * <WatchlistContract 
 *    ticker="TSLA" 
 *    price={700.50} 
 *    change={+3.50} 
 * />
 *
 * - ticker: Symbol or short name (e.g. "TSLA")
 * - price: Current share price (e.g. 700.50)
 * - change: Percentage change, positive or negative (e.g. +3.50, -1.00)
 */
export default function WatchlistContract({ ticker, price, change }) {
  const isPositive = change >= 0;
  const changeColorClass = isPositive ? styles.positiveChange : styles.negativeChange;
  const arrow = isPositive ? "▲" : "▼";
  const absoluteChange = Math.abs(change).toFixed(2);

  return (
    <div className={styles.container}>
      {/* Left side: ticker */}
      <div className={styles.infoSection}>
        <div className={styles.ticker}>{ticker}</div>
      </div>

      {/* Right side: price and color-coded change */}
      <div className={styles.priceSection}>
        <span className={styles.price}>${price.toFixed(2)}</span>
        <span className={`${styles.change} ${changeColorClass}`}>
          {arrow}
          {absoluteChange}%
        </span>
      </div>
    </div>
  );
}
