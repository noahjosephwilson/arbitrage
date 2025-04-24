"use client";
import React from "react";
import styles from "./PositionsContract.module.css";

/**
 * Example usage:
 * <PositionsContract 
 *    contractName="Will the Federal Reserve raise interest rates?" 
 *    contracts={10} 
 *    position="Yes"
 *    price={184.55} 
 *    change={1.25}
 *    imageUrl="path/to/image.jpg"
 * />
 *
 * - contractName: The name of the contract (e.g. "Will the Federal Reserve raise interest rates?")
 * - contracts: Number of contracts (e.g. 10)
 * - position: Position taken (e.g. "Yes" or "No")
 * - price: Current contract price (e.g. 184.55)
 * - change: Percent change in price (e.g. 1.25 or -0.50)
 * - imageUrl: URL for the logo/image
 */
export default function PositionsContract({ contractName, contracts, position, price, change, imageUrl }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Left side: image */}
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={`${contractName} logo`} />
        </div>
        
        {/* Middle: Contract Name and position/contract count info */}
        <div className={styles.infoSection}>
          <div className={styles.contractName} title={contractName}>
            {contractName}
          </div>
          <div className={styles.positionInfo}>
            {position} - {contracts} Contracts
          </div>
        </div>
      </div>
      
      {/* Right side: Price and delta change info */}
      <div className={styles.priceSection}>
        <span className={styles.price}>${price.toFixed(2)}</span>
        <div className={`${styles.delta} ${change >= 0 ? styles.deltaPositive : styles.deltaNegative}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
}
