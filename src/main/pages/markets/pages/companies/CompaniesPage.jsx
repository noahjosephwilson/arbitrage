"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './CompaniesPage.module.css';

const CompaniesPage = () => {
  const subcategories = ["Startups", "Tech Giants", "E-Commerce", "Innovations"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/6F42C1',
      title: 'New startup disrupts the market',
      items: [
        { name: 'Yes', percentage: 68 },
        { name: 'No', percentage: 32 },
      ],
      totalAmount: 98000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6610F2',
      title: 'Tech giants invest in AI research',
      items: [
        { name: 'Yes', percentage: 80 },
        { name: 'No', percentage: 20 },
      ],
      totalAmount: 145000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/343A40',
      title: 'E-Commerce trends for 2025',
      items: [
        { name: 'Yes', percentage: 55 },
        { name: 'No', percentage: 45 },
      ],
      totalAmount: 110000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/20C997',
      title: 'Innovation in company culture drives success',
      items: [
        { name: 'Agree', percentage: 72 },
        { name: 'Disagree', percentage: 28 },
      ],
      totalAmount: 102000,
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

export default CompaniesPage;
