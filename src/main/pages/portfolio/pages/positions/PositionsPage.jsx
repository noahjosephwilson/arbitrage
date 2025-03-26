import React from 'react';
import Filter from './components/filter/Filter'; // Adjust the import path as needed
import styles from './PositionsPage.module.css';

const PositionsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Positions</h1>
      {/* Render the Filter component */}
      <Filter />
    </div>
  );
};

export default PositionsPage;
