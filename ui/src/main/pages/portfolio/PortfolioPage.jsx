import React from "react";
import Stat from "./components/allstats/stat/Stat";
import Navbar from "./components/navbar/Navbar";
import styles from "./PortfolioPage.module.css";

const PortfolioPage = () => {
  // Example change values – these could come from props or state
  const portfolioChange = "+$25.50";
  const cashChange = "+$10.00";
  const profitLossChange = "-$5.75";

  return (
    <div className={styles.container}>
      {/* TOP SECTION: PORTFOLIO, CASH, PROFIT/LOSS */}
      <div className={styles.topSection}>
        <Stat 
          title="PORTFOLIO" 
          descriptor="Total Value" 
          value="$0.00" 
          change={portfolioChange} 
        />
        <Stat 
          title="CASH" 
          descriptor="Available" 
          value="$0.00" 
          change={cashChange} 
        />
        <Stat 
          title="PROFIT/LOSS" 
          descriptor="All-Time" 
          value="$0.00" 
          change={profitLossChange} 
        />
      </div>

      {/* NAVBAR for Positions / Open Orders / History */}
      <Navbar />

      {/* POSITIONS SECTION */}
      <div className={styles.positionsSection}>
        <div className={styles.emptyState}>No positions found.</div>
      </div>
    </div>
  );
};

export default PortfolioPage;
