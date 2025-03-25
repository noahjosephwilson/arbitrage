"use client";

import React from "react";
import styles from "./TradePage.module.css";
import Header from "./components/header/Header";
// import Graph from "./components/Graph/Graph";
import Buy from "./components/buy/Buy";

// Example datasets for each date range
// const datasets = {
//   "6H": [
//     { date: "2024-03-01T14:00:00", value: 0.85 },
//     { date: "2024-03-01T15:00:00", value: 0.87 },
//     { date: "2024-03-01T16:00:00", value: 0.83 },
//   ],
//   "1D": [
//     { date: "2024-03-01T08:00:00", value: 0.80 },
//     { date: "2024-03-01T12:00:00", value: 0.82 },
//     { date: "2024-03-01T16:00:00", value: 0.87 },
//   ],
//   "1W": [
//     { date: "2024-02-24T08:00:00", value: 0.75 },
//     { date: "2024-02-26T08:00:00", value: 0.78 },
//     { date: "2024-03-01T08:00:00", value: 0.87 },
//   ],
//   "1M": [
//     { date: "2024-02-01T08:00:00", value: 0.70 },
//     { date: "2024-02-15T08:00:00", value: 0.80 },
//     { date: "2024-03-01T08:00:00", value: 0.87 },
//   ],
//   "ALL": [
//     { date: "2023-11-01T08:00:00", value: 0.20 },
//     { date: "2023-11-15T08:00:00", value: 0.35 },
//     { date: "2023-12-01T08:00:00", value: 0.30 },
//     { date: "2024-01-05T08:00:00", value: 0.45 },
//     { date: "2024-02-10T08:00:00", value: 0.65 },
//     { date: "2024-03-01T08:00:00", value: 0.87 },
//   ],
// };

const TradePage = () => {
  return (
    <div className={styles.tradePage}>
      <Header
        imageSrc="https://via.placeholder.com/50"
        title="Will Trump Cut the Department of Education?"
      />

      {/* Flex container for page layout (temporarily commented out parts not in use) */}
      {/*
      <div className={styles.pageContainer}>
        <div className={styles.chartContainer}>
          <Graph
            datasets={datasets}
            currentChance={84}
            delta={-0.4}
            brandName="Kalshi"
          />
        </div>
      */}
        <div className={styles.rightPanel}>
          <Buy />
        </div>
      {/*
      </div>
      */}
    </div>
  );
};

export default TradePage;
