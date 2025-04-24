"use client";

import React from 'react';
import FlaggedMarkets from '../flaggedmarkets/FlaggedMarkets';
import FlaggedCardSet from '../flaggedcardset/FlaggedCardSet';
import styles from './Flagged.module.css';

const Flagged = () => {
  return (
    <div className={styles.flaggedContainer}>
      {/* Render the FlaggedMarkets component */}
      <FlaggedMarkets />

      {/* Render the FlaggedCardSet component */}
      <FlaggedCardSet />
    </div>
  );
};

export default Flagged;
