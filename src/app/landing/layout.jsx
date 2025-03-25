import React from 'react';
import Navbar from '@/landing/components/navbar/Navbar';
import Subnavbar from '@/landing/components/subnavbar/Subnavbar';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <subheader>
        <Subnavbar />
      </subheader>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
