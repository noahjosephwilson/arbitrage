"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./MarketsPage.module.css";
import Flagged from "./components/flagged/Flagged"; // Import the combined Flagged component

const MarketsPage = () => {
  const router = useRouter();

  // Event handlers for the action buttons.
  const handleCreateMarket = () => {
    router.push("/admin/markets/createmarket");
  };

  const handleResolveMarket = () => {
    router.push("/admin/markets/findmarket");
  };

  const handleModifyMarket = () => {
    router.push("/modify-market");
  };

  const handleViewMarket = () => {
    router.push("/search-market");
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.actionButton} ${styles.createButton}`}
          onClick={handleCreateMarket}
        >
          Create Market
        </button>
        <button
          className={`${styles.actionButton} ${styles.resolveButton}`}
          onClick={handleResolveMarket}
        >
          Resolve Market
        </button>
        <button
          className={`${styles.actionButton} ${styles.modifyButton}`}
          onClick={handleModifyMarket}
        >
          Modify Market
        </button>
        <button
          className={`${styles.actionButton} ${styles.viewButton}`}
          onClick={handleViewMarket}
        >
          Search Market
        </button>
      </div>
      
      {/* Use the Flagged component that renders both FlaggedMarkets and FlaggedCardSet */}
      <Flagged />
    </div>
  );
};

export default MarketsPage;
