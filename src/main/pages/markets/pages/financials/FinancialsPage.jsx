"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './FinancialsPage.module.css';

const FinancialsPage = () => {
  const subcategories = ["Stocks", "Bonds", "Investing", "Analysis"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/FFC107',
      title: 'Are stocks overvalued?',
      items: [
        { name: 'Yes', percentage: 50 },
        { name: 'No', percentage: 50 },
      ],
      totalAmount: 95000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/28A745',
      title: 'Bond market outlook for Q3',
      items: [
        { name: 'Positive', percentage: 65 },
        { name: 'Negative', percentage: 35 },
      ],
      totalAmount: 105000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/007BFF',
      title: 'Best investment strategies of 2025',
      items: [
        { name: 'Conservative', percentage: 40 },
        { name: 'Aggressive', percentage: 60 },
      ],
      totalAmount: 115000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/DC3545',
      title: 'Trust in current financial analysis?',
      items: [
        { name: 'Yes', percentage: 55 },
        { name: 'No', percentage: 45 },
      ],
      totalAmount: 98000,
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

export default FinancialsPage;
