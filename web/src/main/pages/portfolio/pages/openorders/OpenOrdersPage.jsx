import React from 'react';
import Filter from './components/filter/Filter'; // Adjust the import path if necessary
import styles from './OpenOrdersPage.module.css';

const OpenOrdersPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Open Orders</h1>
      <Filter />
    </div>
  );
};

export default OpenOrdersPage;
