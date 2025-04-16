import React from 'react';
import Allstats from '@/main/pages/portfolio/components/allstats/Allstats';
import Navbar from '@/main/pages/portfolio/components/navbar/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Allstats />
      </header>
      <subheader>
        <Navbar />
      </subheader>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
