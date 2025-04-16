import React, { useState } from 'react';
import styles from './FlaggedMarkets.module.css';

function FlaggedMarkets() {
  // State for search input.
  const [searchTerm, setSearchTerm] = useState('');

  // Simple state for sorting: which field and which direction.
  const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

  // Toggle the sort direction when a column label is clicked.
  const handleSort = (field) => {
    if (sortConfig.field === field) {
      // Toggle direction if already sorting by this field.
      setSortConfig({
        field,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Otherwise, start sorting in ascending order.
      setSortConfig({ field, direction: 'asc' });
    }
  };

  return (
    <div className={styles.container}>
      {/* --- Top Row (Search only) --- */}
      <div className={styles.topRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- Column Labels aligned to FlaggedCardSet columns --- */}
      <div className={styles.columnLabels}>
        <span className={styles.pictureLabel}>Picture</span>
        <span 
          className={styles.nameLabel} 
          onClick={() => handleSort('name')}
        >
          Name {sortConfig.field === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('status')}
        >
          Status {sortConfig.field === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('option')}
        >
          Option {sortConfig.field === 'option' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('resolution')}
        >
          Resolution {sortConfig.field === 'resolution' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('price')}
        >
          Price {sortConfig.field === 'price' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('close')}
        >
          Close {sortConfig.field === 'close' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
        <span 
          className={styles.columnLabel} 
          onClick={() => handleSort('reason')}
        >
          Reason {sortConfig.field === 'reason' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </span>
      </div>

      {/* Horizontal line below column labels */}
      <hr className={styles.separator} />

      {/* Render your table or list below this line */}
      {/* ... */}
    </div>
  );
}

export default FlaggedMarkets;
