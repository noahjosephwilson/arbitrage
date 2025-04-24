import React from 'react';
import styles from './layout.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
