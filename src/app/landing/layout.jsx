import React from 'react';
import Navbar from '@/landing/components/navbar/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
