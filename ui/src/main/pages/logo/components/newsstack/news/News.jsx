import React from "react";
import styles from "./News.module.css";

const News = ({
  imageSrc,
  time,
  title,
  description,
  footerInfo, // publisher name
}) => {
  return (
    <div className={styles.newsContainer}>
      {imageSrc && (
        <div className={styles.imageWrapper}>
          <img src={imageSrc} alt="News thumbnail" className={styles.image} />
        </div>
      )}
      <div className={styles.textContent}>
        <div className={styles.topContent}>
          <div className={styles.headerRow}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {time && <span className={styles.time}>{time}</span>}
          </div>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
        <div className={styles.bottomContent}>
          {footerInfo && <span className={styles.publisher}>{footerInfo}</span>}
        </div>
      </div>
    </div>
  );
};

export default News;
