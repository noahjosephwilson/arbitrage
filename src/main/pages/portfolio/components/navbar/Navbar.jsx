"use client";

import React, { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("positions");

  return (
    <div className={styles.navbar}>
      <button
        className={`${styles.tabButton} ${activeTab === "positions" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("positions")}
      >
        Positions
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === "openOrders" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("openOrders")}
      >
        Open Orders
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === "history" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("history")}
      >
        History
      </button>
    </div>
  );
};

export default Navbar;
