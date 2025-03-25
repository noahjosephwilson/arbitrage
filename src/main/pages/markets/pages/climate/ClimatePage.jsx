"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './ClimatePage.module.css';

const ClimatePage = () => {
  const subcategories = ["Global Warming", "Policy", "Renewables", "Events"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/00ADEF',
      title: 'Is climate change accelerating?',
      items: [
        { name: 'Yes', percentage: 75 },
        { name: 'No', percentage: 25 },
      ],
      totalAmount: 150000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/39B54A',
      title: 'Support for renewable energy initiatives?',
      items: [
        { name: 'Yes', percentage: 65 },
        { name: 'No', percentage: 35 },
      ],
      totalAmount: 120000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/FBB03B',
      title: 'Stricter emission regulations needed?',
      items: [
        { name: 'Yes', percentage: 80 },
        { name: 'No', percentage: 20 },
      ],
      totalAmount: 130000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/8A1538',
      title: 'Is deforestation driving global warming?',
      items: [
        { name: 'Agree', percentage: 70 },
        { name: 'Disagree', percentage: 30 },
      ],
      totalAmount: 110000,
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

export default ClimatePage;
