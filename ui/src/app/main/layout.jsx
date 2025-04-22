import React from 'react';
import Navbar from '@/main/components/navbar/Navbar';
import Footer from '@/main/components/footer/Footer';
import styles from './layout.module.css';
import ProtectedRoute from "@/components/ProtectedRoute";

const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default Layout;
