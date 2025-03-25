"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './EconomicsPage.module.css';

const EconomicsPage = () => {
  const subcategories = ["Markets", "Trade", "Jobs", "Policy"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/007BFF',
      title: 'Stock market trends for 2025',
      items: [
        { name: 'Yes', percentage: 60 },
        { name: 'No', percentage: 40 },
      ],
      totalAmount: 125000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6F42C1',
      title: 'Is international trade improving?',
      items: [
        { name: 'Yes', percentage: 55 },
        { name: 'No', percentage: 45 },
      ],
      totalAmount: 115000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6610F2',
      title: 'Optimism about job growth?',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 135000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/20C997',
      title: 'Economic policies: Support or oppose?',
      items: [
        { name: 'Support', percentage: 65 },
        { name: 'Oppose', percentage: 35 },
      ],
      totalAmount: 120000,
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

export default EconomicsPage;
