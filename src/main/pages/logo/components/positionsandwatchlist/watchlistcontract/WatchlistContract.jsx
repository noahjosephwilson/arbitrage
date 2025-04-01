"use client";
import React from "react";
import styles from "./WatchlistContract.module.css";

/**
 * Example usage:
 * <WatchlistContract 
 *    ticker="TSLA" 
 *    price={700.50} 
 *    change={+3.50}
 *    imageUrl="path/to/image.jpg"
 * />
 *
 * - ticker: Symbol or short name (e.g. "TSLA")
 * - price: Current share price (e.g. 700.50)
 * - change: Percentage change, positive or negative (e.g. +3.50, -1.00)
 * - imageUrl: URL for the logo/image
 */
export default function WatchlistContract({ ticker, price, change, imageUrl }) {
  const isPositive = change >= 0;
  const changeColorClass = isPositive ? styles.deltaPositive : styles.deltaNegative;
  
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Left side: image */}
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={`${ticker} logo`} />
        </div>
        {/* Middle: Ticker (as the contract name) */}
        <div className={styles.infoSection}>
          <div className={styles.contractName} title={ticker}>
            {ticker}
          </div>
          {/* No additional position/contract count info */}
        </div>
      </div>
      {/* Right side: Price and delta change info */}
      <div className={styles.priceSection}>
        <span className={styles.price}>${price.toFixed(2)}</span>
        <div className={`${styles.delta} ${changeColorClass}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
}
