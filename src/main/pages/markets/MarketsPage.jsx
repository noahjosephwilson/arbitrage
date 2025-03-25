"use client";

import React from 'react';
import Card from '@/main/pages/markets/components/card/Card'; // Now the unified Card component
import styles from './MarketsPage.module.css';

const MarketsPage = () => {
  const cardsData = [
    // Yes/No cards
    {
      imageSrc: 'https://via.placeholder.com/50/FF5733',
      title: 'Will it rain tomorrow?',
      items: [
        { name: 'Yes', percentage: 70 },
        { name: 'No', percentage: 30 },
      ],
      totalAmount: 123456,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/33FF57',
      title: 'Is the stock market going up?',
      items: [
        { name: 'Yes', percentage: 55 },
        { name: 'No', percentage: 45 },
      ],
      totalAmount: 234567,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/3357FF',
      title: 'Will the local team win the championship?',
      items: [
        { name: 'Yes', percentage: 80 },
        { name: 'No', percentage: 20 },
      ],
      totalAmount: 345678,
    },
    // Multi-option cards (more than two items)
    {
      imageSrc: 'https://via.placeholder.com/50/FF33A1',
      title: 'Which color do you prefer?',
      items: [
        { name: 'Red', percentage: 40 },
        { name: 'Blue', percentage: 35 },
        { name: 'Green', percentage: 25 },
      ],
      totalAmount: 456789,
    },
    // Multi-option card with two options that are not yes/no
    {
      imageSrc: 'https://via.placeholder.com/50/FF33A1',
      title: 'Which color do you prefer?',
      items: [
        { name: 'Red', percentage: 40 },
        { name: 'Blue', percentage: 35 },
      ],
      totalAmount: 456789,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/A133FF',
      title: 'Which programming language is best?',
      items: [
        { name: 'JavaScript', percentage: 50 },
        { name: 'Python', percentage: 30 },
        { name: 'Java', percentage: 20 },
      ],
      totalAmount: 567890,
    },
    {
      imageSrc: 'https://via.placeholder.com/50/33FFA1',
      title: 'What is your favorite season?',
      items: [
        { name: 'Spring', percentage: 25 },
        { name: 'Summer', percentage: 25 },
        { name: 'Autumn', percentage: 25 },
        { name: 'Winter', percentage: 25 },
      ],
      totalAmount: 678901,
    },
  ];

  // Randomize the order of cards
  const randomizedCardsData = [...cardsData].sort(() => Math.random() - 0.5);

  return (
    <div className={styles.container}>
      <div className={styles.itemsGrid}>
        {randomizedCardsData.map((card, index) => {
          // Determine if this is a yes/no (binary) card:
          const isYesNo =
            card.items.length === 2 &&
            card.items.some(item => item.name.toLowerCase() === 'yes') &&
            card.items.some(item => item.name.toLowerCase() === 'no');

          // For single-option cards, we also use the binary layout with no second option.
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
            // For multi-option cards (or two-option cards that aren't yes/no), pass the items array.
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

export default MarketsPage;
