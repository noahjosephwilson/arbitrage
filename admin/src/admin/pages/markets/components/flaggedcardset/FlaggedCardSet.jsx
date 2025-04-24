import React from 'react';
import FlaggedCard from './components/flaggedcard/FlaggedCard';
import styles from './FlaggedCardSet.module.css';

const FlaggedCardSet = () => {
  // Updated sample data using the three status values.
  const sampleCards = [
    {
      imageUrl: 'https://via.placeholder.com/40',
      marketName: 'Global Market Analysis With A Really Long Name That Should Be Clipped Appropriately',
      status: 'Verify',
      option: 'Warren',
      resolution: 'Yes',
      price: 99, // Price in cents
      closeDate: '12/31/2025',
      reason: 'Price',
    },
    {
      imageUrl: 'https://via.placeholder.com/40',
      marketName: 'Local Market Trends',
      status: 'Reviewing',
      option: 'Economy',
      resolution: '9/10',
      price: 29900, // Price in cents
      closeDate: '11/15/2025',
      reason: 'Market slowdown',
    },
    {
      imageUrl: 'https://via.placeholder.com/40',
      marketName: 'International Insights',
      status: 'Unresolved',
      option: 'Standard',
      resolution: '8/10',
      price: 39900, // Price in cents
      closeDate: '10/30/2025',
      reason: 'Stable growth',
    },
  ];

  return (
    <div className={styles.cardContainer}>
      {sampleCards.map((card, index) => (
        <FlaggedCard key={index} {...card} />
      ))}
    </div>
  );
};

export default FlaggedCardSet;
