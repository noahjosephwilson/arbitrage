"use client";

import React from 'react';

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const Loading = () => {
  return (
    <>
      {/* Inject keyframes for spinner animation */}
      <style>{keyframes}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#fff',
        }}
      >
        {/* Spinner */}
        <div
          style={{
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #00c28e',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Company Name */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#00c28e',
            fontFamily: 'sans-serif',
          }}
        >
          Arbitrage
        </div>
      </div>
    </>
  );
};

export default Loading;
