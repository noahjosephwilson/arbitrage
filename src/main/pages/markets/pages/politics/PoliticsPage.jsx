"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card';
import Subcategories from '@/main/pages/markets/components/subcategories/Subcategories';
import styles from './PoliticsPage.module.css';

const PoliticsPage = () => {
  const subcategories = ["Elections", "Policy", "Government", "Diplomacy"];
  
  const cardsData = [
    {
      imageSrc: 'https://via.placeholder.com/50/343A40',
      title: 'Upcoming election: Who will win?',
      items: [
        { name: 'Yes', percentage: 60 },
        { name: 'No', percentage: 40 },
      ],
      totalAmount: 130000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/007BFF',
      title: 'Trust in current government policies?',
      items: [
        { name: 'Yes', percentage: 55 },
        { name: 'No', percentage: 45 },
      ],
      totalAmount: 125000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/6610F2',
      title: 'Is diplomacy the key to peace?',
      items: [
        { name: 'Agree', percentage: 70 },
        { name: 'Disagree', percentage: 30 },
      ],
      totalAmount: 115000,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/28A745',
      title: 'Should policies be reformed for progress?',
      items: [
        { name: 'Yes', percentage: 65 },
        { name: 'No', percentage: 35 },
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

export default PoliticsPage;
