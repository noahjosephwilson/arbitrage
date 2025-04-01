"use client";
import React from "react";
import styles from "./PositionsContract.module.css";

/**
 * Example usage:
 * <PositionsContract 
 *    ticker="DMI" 
 *    shares={20} 
 *    price={184.55} 
 *    imageUrl="path/to/image.jpg"
 * />
 *
 * - ticker: Symbol or short name (e.g. "DMI")
 * - shares: Number of shares (e.g. 20)
 * - price: Current share price (e.g. 184.55)
 * - imageUrl: URL for the logo image
 */
export default function PositionsContract({ ticker, shares, price, imageUrl }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Left side: image */}
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={`${ticker} logo`} />
        </div>
        
        {/* Middle: ticker and shares info */}
        <div className={styles.infoSection}>
          <div className={styles.ticker}>{ticker}</div>
          <div className={styles.shares}>{shares} Shares</div>
        </div>
      </div>
      
      {/* Right side: Price info */}
      <div className={styles.priceSection}>
        <span className={styles.price}>${price.toFixed(2)}</span>
      </div>
    </div>
  );
}
