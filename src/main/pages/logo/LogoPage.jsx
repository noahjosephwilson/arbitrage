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
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
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
      <div className={styles.graphSection}>
        <h2 className={styles.sectionTitle}>Market Overview</h2>
        <div className={styles.chartContainer}>
          <Line data={sampleData} options={sampleOptions} />
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
