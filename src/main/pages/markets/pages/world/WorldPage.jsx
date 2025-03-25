"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './WorldPage.module.css';

const WorldPage = () => {
  const subcategories = ["International", "Diplomacy", "Conflicts", "Global News"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/343A40',
      title: 'Global summit: Key outcomes',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 135000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/007BFF',
      title: 'Diplomatic relations: Improving or worsening?',
      items: [
        { name: 'Yes', percentage: 60 },
        { name: 'No', percentage: 40 },
      ],
      totalAmount: 125000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6610F2',
      title: 'Are global conflicts reducing?',
      items: [
        { name: 'Agree', percentage: 75 },
        { name: 'Disagree', percentage: 25 },
      ],
      totalAmount: 140000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/28A745',
      title: 'Global news: More balanced or biased?',
      items: [
        { name: 'Balanced', percentage: 65 },
        { name: 'Biased', percentage: 35 },
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

export default WorldPage;
