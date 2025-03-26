"use client";
import React from 'react';
import styles from './LogoPage.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const sampleData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Stock Price',
      data: [100, 120, 150, 130, 170, 160],
      fill: false,
      backgroundColor: '#00c28e',
      borderColor: '#00c28e',
      tension: 0.3,
    },
  ],
};

const sampleOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { display: true },
    y: { display: true },
  },
};

const LogoPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.graphSection}>
          <h2 className={styles.sectionTitle}>Market Overview</h2>
          <div className={styles.chartContainer}>
            <Line data={sampleData} options={sampleOptions} />
          </div>
        </div>
        <div className={styles.newsCardsSection}>
          <h2 className={styles.sectionTitle}>Latest News</h2>
          <div className={styles.newsCardsContainer}>
            <div className={styles.newsCard}>
              <h3>Tech Stocks Rally</h3>
              <p>
                Tech stocks saw significant gains today, with several leading companies reporting strong earnings.
              </p>
              <span>2 hrs ago</span>
            </div>
            <div className={styles.newsCard}>
              <h3>Market Update</h3>
              <p>
                The market is experiencing increased volatility amid global economic uncertainties.
              </p>
              <span>4 hrs ago</span>
            </div>
            <div className={styles.newsCard}>
              <h3>New IPO Announced</h3>
              <p>
                A promising new IPO is set to debut, generating buzz among investors.
              </p>
              <span>1 day ago</span>
            </div>
            {/* Add more news cards as needed */}
          </div>
        </div>
      </div>
      <div className={styles.watchlistSection}>
        <h2 className={styles.sectionTitle}>Your Watchlist</h2>
        <ul className={styles.watchlist}>
          <li>AAPL - Apple Inc.</li>
          <li>TSLA - Tesla Inc.</li>
          <li>AMZN - Amazon.com Inc.</li>
          {/* Add more stocks as needed */}
        </ul>
      </div>
    </div>
  );
};

export default LogoPage;
