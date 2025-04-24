import React from 'react';
import Navbar from '@/admin/components/navbar/Navbar';
import styles from './layout.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <header className={styles.header}>
        <Navbar profileImageUrl="/knight.jpg" />
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
