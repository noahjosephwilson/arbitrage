import React, { useState } from 'react';
import styles from './FlaggedMarkets.module.css';

interface Market {
  id: string;
  title: string;
  status: string;
  date: string;
}

const SAMPLE_MARKETS: Market[] = [
  {
    id: '1',
    title: 'NBA Championship Winner',
    status: 'Pending Review',
    date: '2024-04-25'
  },
  {
    id: '2',
    title: 'Presidential Election Outcome',
    status: 'Needs Moderation',
    date: '2024-04-24'
  },
  {
    id: '3',
    title: 'Oscar Best Picture',
    status: 'Under Review',
    date: '2024-04-23'
  }
];

const FlaggedMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>(SAMPLE_MARKETS);
  const [sortField, setSortField] = useState<keyof Market>('date');

  const handleSort = (field: keyof Market) => {
    setSortField(field);
    setMarkets(prevMarkets => 
      [...prevMarkets].sort((a, b) => 
        a[field].localeCompare(b[field])
      )
    );
  };

  return (
    <div className={styles.flaggedMarkets}>
      <h2 className={styles.title}>Flagged Markets</h2>
      <div className={styles.marketList}>
        {markets.map((market) => (
          <div key={market.id} className={styles.marketItem}>
            <div className={styles.marketTitle}>{market.title}</div>
            <div className={styles.marketStatus} data-status={market.status}>
              {market.status}
            </div>
            <div className={styles.marketDate}>{market.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlaggedMarkets; 