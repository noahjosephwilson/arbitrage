import React from 'react';
import Navbar from '@/landing/components/navbar/Navbar';
import Footer from '@/main/components/footer/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
