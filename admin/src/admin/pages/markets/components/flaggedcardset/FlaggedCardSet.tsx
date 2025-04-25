import React from 'react';
import styles from './FlaggedCardSet.module.css';

interface CardSet {
  id: string;
  title: string;
  status: string;
  date: string;
}

const SAMPLE_CARD_SETS: CardSet[] = [
  {
    id: '1',
    title: 'Sports Championship Series',
    status: 'Pending Review',
    date: '2024-04-25'
  },
  {
    id: '2',
    title: 'Political Election Outcomes',
    status: 'Needs Moderation',
    date: '2024-04-24'
  },
  {
    id: '3',
    title: 'Entertainment Awards',
    status: 'Under Review',
    date: '2024-04-23'
  }
];

const FlaggedCardSet: React.FC = () => {
  return (
    <div className={styles.flaggedCardSet}>
      <h2 className={styles.title}>Flagged Card Sets</h2>
      <div className={styles.cardSetList}>
        {SAMPLE_CARD_SETS.map((cardSet) => (
          <div key={cardSet.id} className={styles.cardSetItem}>
            <div className={styles.cardSetTitle}>{cardSet.title}</div>
            <div className={styles.cardSetStatus} data-status={cardSet.status}>
              {cardSet.status}
            </div>
            <div className={styles.cardSetDate}>{cardSet.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlaggedCardSet; 