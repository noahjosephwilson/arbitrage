import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      {/* Top section with columns positioned relative to the page edges */}
      <div className={styles.footerTop}>
        <div className={`${styles.footerColumn} ${styles.leftColumn}`}>
          <h4 className={styles.footerTitle}>Company</h4>
          <ul className={styles.footerList}>
            <li><a href="/press">Press</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/elections">Elections</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/data-terms">Data Terms of Service</a></li>
          </ul>
        </div>
        <div className={`${styles.footerColumn} ${styles.centerColumn}`}>
          <h4 className={styles.footerTitle}>Social</h4>
          <ul className={styles.footerList}>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <div className={`${styles.footerColumn} ${styles.rightColumn}`}>
          <h4 className={styles.footerTitle}>Product</h4>
          <ul className={styles.footerList}>
            <li><a href="/help-center">Help Center</a></li>
            <li><a href="/api">API</a></li>
            <li><a href="/faq-finance-pros">FAQ for Finance Professionals</a></li>
            <li><a href="/regulatory">Regulatory</a></li>
            <li><a href="/trading-hours">Trading Hours</a></li>
            <li><a href="/fee-schedule">Fee Schedule</a></li>
            <li><a href="/trading-opinions">Trading Opinions</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className={styles.footerBottom}>
        <p className={styles.disclaimer}>
          © 2025 Arbitrage Inc. Trading on Arbitrage involves risk and may not be appropriate for all.
          Members risk losing their cost to enter any transaction, including fees. You should carefully
          consider whether trading on Arbitrage is appropriate in light of your investment experience and
          financial resources. Any trading decisions you make are solely your responsibility and at your
          own risk. Information is provided for your convenience only on an “AS IS” basis. Past performance
          is not necessarily indicative of future results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
