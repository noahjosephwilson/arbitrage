"use client";
import React from 'react';
import styles from './LogoPage.module.css';
import Graph from './components/graph/Graph'; // Import the Graph component
import Positionsandwatchlist from './components/positionsandwatchlist/Positionsandwatchlist'; // Import the positions/watchlist component

export default function LogoPage() {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.graphWrapper}>
          <Graph />
        </div>
        <div className={styles.positionsWrapper}>
          <Positionsandwatchlist />
        </div>
      </div>
    </div>
  );
}
