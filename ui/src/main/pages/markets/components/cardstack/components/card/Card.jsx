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
  noInfo
}) {
  const router = useRouter();
  const [isToggled, setIsToggled] = useState(false);
  const isBinary = yesInfo !== undefined && noInfo !== undefined;

  /**
   * info: "start→end"
   * pct: integer percentage (0–100)
   * invert: true for the No column
   */
  const renderMoneyInfo = (info, pct, invert = false) => {
    const parts = info.split("→");
    const startMoney = parts[0].trim();

    // If percentage is zero, always show "--" after the arrow
    if (pct === 0) {
      return (
        <span>
          <span className={styles.startMoney}>{startMoney}</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.endMoney}>--</span>
        </span>
      );
    }

    // Otherwise compute decimal = pct/100 or (1 - pct/100)
    const decimal = invert ? 1 - pct / 100 : pct / 100;

    // Protect against decimal === 0 (e.g. pct===100 and invert)
    if (decimal === 0) {
      return (
        <span>
          <span className={styles.startMoney}>{startMoney}</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.endMoney}>--</span>
        </span>
      );
    }

    // floor(100 * (1/decimal))
    const floored = Math.floor(100 * (1 / decimal));
    const symbolMatch = startMoney.match(/^[^\d]*/);
    const symbol = symbolMatch ? symbolMatch[0] : "";
    const endMoney = symbol + floored.toLocaleString();

    return (
      <span>
        <span className={styles.startMoney}>{startMoney}</span>
        <span className={styles.arrow}>→</span>
        <span className={styles.endMoney}>{endMoney}</span>
      </span>
    );
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card} onClick={() => router.push("/main/trade")}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                className={styles.cardImage}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/60";
                }}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
            <h2 className={styles.cardTitle}>{title}</h2>
          </div>
          {isBinary && percentage !== undefined && (
            <div className={styles.cardPercentage}>
              {percentage === 0 ? (
                <>
                  <span className={styles.percentageNumber}>-</span>
                  <span className={styles.percentSign}>%</span>
                </>
              ) : (
                <>
                  <span className={styles.percentageNumber}>{percentage}</span>
                  <span className={styles.percentSign}>%</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Body */}
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
                  {renderMoneyInfo(yesInfo, percentage, false)}
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
                  {renderMoneyInfo(noInfo, percentage, true)}
                </div>
              </div>
            </div>
          ) : (
            items.slice(0, 2).map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <div
                  className={`${styles.itemName} ${
                    idx === 1 && items.length > 2 ? styles.withMore : ""
                  }`}
                >
                  {item.name}
                  {idx === 1 && items.length > 2 && (
                    <span className={styles.moreText}>more</span>
                  )}
                </div>
                <div className={styles.itemPercentage}>
                  <span className={styles.percentageNumber}>{item.percentage}</span>
                  <span className={styles.percentSign}>%</span>
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

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.totalAmount}>
            ${Math.floor(Number(totalAmount)).toLocaleString()}
          </span>
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
