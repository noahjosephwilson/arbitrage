import React from "react";
import styles from "./Stat.module.css";

const Stat = ({ title, descriptor, value }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.cardText}>
          <div className={styles.cardHeader}>{title}</div>
          <div className={styles.cardSub}>{descriptor}</div>
        </div>
        <div className={styles.cardValue}>{value}</div>
      </div>
    </div>
  );
};

export default Stat;
