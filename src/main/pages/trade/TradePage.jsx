"use client";
import React from "react";
import styles from "./TradePage.module.css";
import Header from "./components/header/Header";
import Graph from "./components/graph/Graph";
import Buy from "./components/buy/Buy";

const TradePage = () => {
  return (
    <div className={styles.tradePage}>
      <Header
        imageSrc="https://via.placeholder.com/50"
        title="Will Trump Cut the Department of Education?"
      />
      <div className={styles.pageContainer}>
        <div className={styles.leftPanel}>
          <Graph />
        </div>
        <div className={styles.rightPanel}>
          <Buy />
        </div>
      </div>
    </div>
  );
};

export default TradePage;
