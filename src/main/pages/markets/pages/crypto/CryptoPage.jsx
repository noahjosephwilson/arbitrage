"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './CryptoPage.module.css';

const CryptoPage = () => {
  const subcategories = ["Bitcoin", "Ethereum", "Altcoins", "NFTs"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/F7931A',
      title: 'Bitcoin hits a new all-time high',
      items: [
        { name: 'Yes', percentage: 85 },
        { name: 'No', percentage: 15 },
      ],
      totalAmount: 200000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/3C3C3D',
      title: 'Ethereum 2.0 launch success?',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 175000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/FF4500',
      title: 'Are altcoins the future?',
      items: [
        { name: 'Yes', percentage: 60 },
        { name: 'No', percentage: 40 },
      ],
      totalAmount: 160000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/DA1884',
      title: 'NFTs: Hype or breakthrough?',
      items: [
        { name: 'Agree', percentage: 50 },
        { name: 'Disagree', percentage: 50 },
      ],
      totalAmount: 140000,
    },
  ];
  
  const randomizedCardsData = [...cardsData].sort(() => Math.random() - 0.5);
  
  return (
    <div className={styles.container}>
      <Subcategories subcategories={subcategories} defaultActive={subcategories[0]} />
      <div className={styles.itemsGrid}>
        {randomizedCardsData.map((card, index) => {
          const isYesNo =
            card.items.length === 2 &&
            card.items.some(item => item.name.toLowerCase() === 'yes') &&
            card.items.some(item => item.name.toLowerCase() === 'no');
            
          if (isYesNo || card.items.length === 1) {
            let yesItem, noItem;
            if (isYesNo) {
              yesItem = card.items.find(item => item.name.toLowerCase() === 'yes');
              noItem = card.items.find(item => item.name.toLowerCase() === 'no');
            } else {
              yesItem = card.items[0];
              noItem = undefined;
            }
            return (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                percentage={yesItem.percentage}
                yesInfo={`$100 → $${(yesItem.percentage * 2.78).toFixed(2)}`}
                noInfo={noItem ? `$100 → $${(noItem.percentage * 1.45).toFixed(2)}` : ''}
              />
            );
          } else {
            return (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                totalAmount={card.totalAmount}
                items={card.items}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default CryptoPage;
