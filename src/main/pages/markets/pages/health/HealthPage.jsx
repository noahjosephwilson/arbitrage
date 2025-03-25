"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './HealthPage.module.css';

const HealthPage = () => {
  const subcategories = ["Nutrition", "Fitness", "Mental Health", "Medical"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/FF5733',
      title: 'Is a balanced diet key to good health?',
      items: [
        { name: 'Yes', percentage: 80 },
        { name: 'No', percentage: 20 },
      ],
      totalAmount: 105000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/33FF57',
      title: 'Do you exercise regularly?',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 98000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/3357FF',
      title: 'Is mental health awareness improving?',
      items: [
        { name: 'Yes', percentage: 75 },
        { name: 'No', percentage: 25 },
      ],
      totalAmount: 112000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/FF33A1',
      title: 'Should medical research get more funding?',
      items: [
        { name: 'Agree', percentage: 85 },
        { name: 'Disagree', percentage: 15 },
      ],
      totalAmount: 99000,
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

export default HealthPage;
