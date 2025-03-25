"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './CulturePage.module.css';

const CulturePage = () => {
  const subcategories = ["Art", "Music", "Fashion", "Theater"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/FF6F61',
      title: 'New art exhibit opens downtown',
      items: [
        { name: 'Yes', percentage: 65 },
        { name: 'No', percentage: 35 },
      ],
      totalAmount: 90000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6B5B95',
      title: 'Music festival lineup announced',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 105000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/88B04B',
      title: 'Fashion trends: Bold or classic?',
      items: [
        { name: 'Bold', percentage: 55 },
        { name: 'Classic', percentage: 45 },
      ],
      totalAmount: 95000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/F7CAC9',
      title: 'Theater production receives rave reviews',
      items: [
        { name: 'Agree', percentage: 80 },
        { name: 'Disagree', percentage: 20 },
      ],
      totalAmount: 88000,
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

export default CulturePage;
