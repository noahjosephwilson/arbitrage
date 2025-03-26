import React from 'react';
import Subnavbar from '@/main/pages/markets/components/subnavbar/Subnavbar';
import styles from './layout.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <div className={styles.subheader}>
        <Subnavbar />
      </div>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
