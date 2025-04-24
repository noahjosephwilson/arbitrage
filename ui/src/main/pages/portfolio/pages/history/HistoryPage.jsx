import React from 'react';
import Filter from './components/filter/Filter'; // Adjust the import path if necessary
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order History</h1>
      <Filter />
    </div>
  );
};

export default HistoryPage;
