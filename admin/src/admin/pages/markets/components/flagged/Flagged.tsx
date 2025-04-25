"use client";

import React from 'react';
import styles from './Flagged.module.css';
import FlaggedMarkets from '../flaggedmarkets/FlaggedMarkets';
import FlaggedCardSet from '../flaggedcardset/FlaggedCardSet';

const Flagged: React.FC = () => {
  return (
    <div className={styles.flaggedContainer}>
      <FlaggedMarkets />
      <FlaggedCardSet />
    </div>
  );
};

export default Flagged; 