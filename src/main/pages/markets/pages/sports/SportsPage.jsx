"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './SportsPage.module.css';

const SportsPage = () => {
  const subcategories = ["Soccer", "Basketball", "Baseball", "Tennis"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/FF5733',
      title: 'Local soccer team advances to finals',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 140000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/33FF57',
      title: 'Championship predictions for basketball',
      items: [
        { name: 'Yes', percentage: 65 },
        { name: 'No', percentage: 35 },
      ],
      totalAmount: 135000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/3357FF',
      title: 'Rookie sensation in baseball emerges',
      items: [
        { name: 'Yes', percentage: 80 },
        { name: 'No', percentage: 20 },
      ],
      totalAmount: 150000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/FFC107',
      title: 'Tennis match: Upset or expected outcome?',
      items: [
        { name: 'Agree', percentage: 60 },
        { name: 'Disagree', percentage: 40 },
      ],
      totalAmount: 130000,
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

export default SportsPage;
