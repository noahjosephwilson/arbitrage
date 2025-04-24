import React from "react";
import Stat from "@/main/pages/portfolio/components/allstats/stat/Stat";
import styles from "./Allstats.module.css";

const Allstats = () => {
  // Example change values – these could be passed as props or set via state
  const portfolioChange = "+$25.50";
  const cashChange = "+$10.00";
  const profitLossChange = "-$5.75";

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default Allstats;
