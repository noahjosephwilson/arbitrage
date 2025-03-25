"use client";
import React from 'react';
import styles from './PortfolioPage.module.css';

const samplePortfolio = [
  { ticker: 'AAPL', name: 'Apple Inc.', quantity: 10, price: 150 },
  { ticker: 'TSLA', name: 'Tesla Inc.', quantity: 5, price: 700 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', quantity: 2, price: 3200 },
];

const PortfolioPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Portfolio</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price ($)</th>
            <th>Total Value ($)</th>
          </tr>
        </thead>
        <tbody>
          {samplePortfolio.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.name}</td>
              <td>{stock.quantity}</td>
              <td>{stock.price.toFixed(2)}</td>
              <td>{(stock.quantity * stock.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioPage;
