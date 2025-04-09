import React from 'react';

const MarketsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Markets</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={{ marginRight: '10px' }}>Create Market</button>
        <button style={{ marginRight: '10px' }}>Modify Market</button>
        <button style={{ marginRight: '10px' }}>Resolve Market</button>
      </div>
      <ul>
        <li>Market 1 - Ready to Close</li>
        <li>Market 2 - Ready to Close</li>
        <li>Market 3 - Ready to Close</li>
      </ul>
    </div>
  );
};

export default MarketsPage;
