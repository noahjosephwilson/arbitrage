import React from 'react';
import Subnavbar from '@/main/pages/markets/components/subnavbar/Subnavbar';

const Layout = ({ children }) => {
  return (
    <div>
      <subheader>
        <Subnavbar/>
      </subheader>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
