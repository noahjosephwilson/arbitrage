import React from 'react';
import Navbar from '@/landing/components/navbar/Navbar';
import Footer from '@/main/components/footer/Footer';
import styles from './layout.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
