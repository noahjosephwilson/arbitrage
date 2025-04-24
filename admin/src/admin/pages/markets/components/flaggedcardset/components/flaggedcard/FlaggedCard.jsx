import React from 'react';
import styles from './FlaggedCard.module.css';

function FlaggedCard({
  imageUrl,
  marketName,
  status,
  option,
  resolution,
  price,
  closeDate,
  reason,
}) {
  return (
    <div className={styles.card}>
      {/* Picture */}
      <div className={styles.picture}>
        <img src={imageUrl} alt="Picture" className={styles.image} />
      </div>

      {/* Name */}
      <div className={styles.name}>
        {marketName}
      </div>

      {/* Status */}
      <div className={`${styles.column} ${styles.status} ${styles[status.toLowerCase()]}`}>
        {status}
      </div>

      {/* Option */}
      <div className={styles.column}>{option}</div>

      {/* Resolution */}
      <div className={styles.column}>{resolution}</div>

      {/* Price (in cents) */}
      <div className={styles.column}>{price}</div>

      {/* Close */}
      <div className={styles.column}>{closeDate}</div>

      {/* Reason */}
      <div className={styles.column}>{reason}</div>
    </div>
  );
}

export default FlaggedCard;
