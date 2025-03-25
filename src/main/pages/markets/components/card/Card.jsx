"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Card.module.css";

function Card({
  imageSrc,
  title,
  totalAmount,
  items = [],
  percentage,
  yesInfo,
  noInfo,
}) {
  const router = useRouter();
  const [isToggled, setIsToggled] = useState(false);
  const isBinary = yesInfo !== undefined && noInfo !== undefined;

  const renderMoneyInfo = (info) => {
    const parts = info.split("→");
    if (parts.length === 2) {
      const startMoney = parts[0].trim();
      const endMoney = parts[1].trim();
      return (
        <span>
          <span className={styles.startMoney}>{startMoney}</span>
          {" → "}
          <span className={styles.endMoney}>{endMoney}</span>
        </span>
      );
    }
    return info;
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card} onClick={() => router.push("/main/trade")}>
        {/* CARD HEADER */}
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Card graphic"
                className={styles.cardImage}
              />
            )}
            <h2 className={styles.cardTitle}>{title}</h2>
          </div>
          {isBinary && percentage !== undefined && (
            <div className={styles.cardPercentage}>{percentage}%</div>
          )}
        </div>

        {/* CARD BODY */}
        <div className={styles.cardBody}>
          {isBinary ? (
            <div className={styles.optionsRow}>
              <div className={styles.optionColumn}>
                <button
                  className={`${styles.optionButton} ${styles.yesButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/main/trade");
                  }}
                >
                  Yes
                </button>
                <div className={styles.optionValue}>
                  {renderMoneyInfo(yesInfo)}
                </div>
              </div>
              <div className={styles.optionColumn}>
                <button
                  className={`${styles.optionButton} ${styles.noButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/main/trade");
                  }}
                >
                  No
                </button>
                <div className={styles.optionValue}>
                  {renderMoneyInfo(noInfo)}
                </div>
              </div>
            </div>
          ) : (
            items &&
            items.slice(0, 2).map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div
                  className={`${styles.itemName} ${
                    index === 1 && items.length > 2 ? styles.withMore : ""
                  }`}
                >
                  {item.name}
                  {index === 1 && items.length > 2 && (
                    <span className={styles.moreText}>more</span>
                  )}
                </div>
                <div className={styles.itemPercentage}>
                  {item.percentage}%
                </div>
                <div className={styles.votingButtons}>
                  <button
                    className={styles.multiyesButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/main/trade");
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className={styles.multinoButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/main/trade");
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CARD FOOTER */}
        <div className={styles.cardFooter}>
          <span className={styles.totalAmount}>
            ${Number(totalAmount).toLocaleString()}
          </span>

          {/* TOGGLE ICON */}
          <div
            className={styles.iconCircle}
            onClick={(e) => {
              e.stopPropagation();
              setIsToggled((prev) => !prev);
            }}
          >
            <div className={isToggled ? styles.checkIcon : styles.plusIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
