import React from 'react';
import Subnavbar from '@/landing/components/subnavbar/Subnavbar';

const Layout = ({ children }) => {
  return (
    <div>
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
