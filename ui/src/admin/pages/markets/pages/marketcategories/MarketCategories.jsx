"use client";

import React, { useState } from 'react';
import styles from './MarketCategories.module.css';

// Primary categories with their corresponding secondary options.
const primaryCategories = {
  All: ["Trending", "Latest", "Popular"],
  Politics: ["Elections", "Policy", "Government", "Diplomacy"],
  Sports: ["Soccer", "Basketball", "Baseball", "Tennis"],
  Culture: ["Art", "Music", "Fashion", "Theater"],
  Crypto: ["Bitcoin", "Ethereum", "Altcoins", "NFTs"],
  Climate: ["Global Warming", "Policy", "Renewables", "Events"],
  Economics: ["Markets", "Trade", "Jobs", "Policy"],
  Companies: ["Startups", "Tech Giants", "E-Commerce", "Innovations"],
  Financials: ["Stocks", "Bonds", "Investing", "Analysis"],
  Tech: ["Gadgets", "AI", "Space", "Research"],
  Health: ["Nutrition", "Fitness", "Mental Health", "Medical"],
  World: ["International", "Diplomacy", "Conflicts", "Global News"],
};

function MarketCategories() {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [market, setMarket] = useState("");
  const [markets, setMarkets] = useState([]);

  const handlePrimaryChange = (e) => {
    setPrimary(e.target.value);
    setSecondary("");
  };

  const handleAddMarket = () => {
    if (market.trim() !== "") {
      setMarkets([...markets, market.trim()]);
      setMarket("");
    }
  };

  const handleDeleteMarkets = () => {
    setMarkets([]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Market Categories</h2>
        <div className={styles.dropdownContainer}>
          <label className={styles.label}>
            Primary Category
            <select 
              className={styles.select} 
              value={primary} 
              onChange={handlePrimaryChange}
            >
              <option value="">Select a category</option>
              {Object.keys(primaryCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className={styles.dropdownContainer}>
          <label className={styles.label}>
            Secondary Category
            <select 
              className={styles.select} 
              value={secondary} 
              onChange={(e) => setSecondary(e.target.value)}
              disabled={!primary}
            >
              <option value="">Select a subcategory</option>
              {primary && primaryCategories[primary].map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className={styles.marketSection}>
          <input 
            type="text" 
            className={styles.input} 
            value={market} 
            onChange={(e) => setMarket(e.target.value)}
            placeholder="Enter market"
          />
          <button className={styles.addButton} onClick={handleAddMarket}>Add</button>
          <button className={styles.deleteButton} onClick={handleDeleteMarkets}>Delete</button>
        </div>

        {markets.length > 0 && (
          <ul className={styles.marketList}>
            {markets.map((item, index) => (
              <li key={index} className={styles.marketItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MarketCategories;
