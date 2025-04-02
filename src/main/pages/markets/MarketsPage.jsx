"use client";

import React from "react";
import CardStack from "@/main/pages/markets/components/cardstack/CardStack"; // Adjust the import path if needed
import styles from "./MarketsPage.module.css";

const MarketsPage = () => {
  const cardsData = [
    // Yes/No cards
    {
      imageSrc: "https://via.placeholder.com/50/FF5733",
      title: "Will it rain tomorrow?",
      items: [
        { name: "Yes", percentage: 70 },
        { name: "No", percentage: 30 },
      ],
      totalAmount: 123456,
    },
    {
      imageSrc: "https://via.placeholder.com/50/33FF57",
      title: "Is the stock market going up?",
      items: [
        { name: "Yes", percentage: 55 },
        { name: "No", percentage: 45 },
      ],
      totalAmount: 234567,
    },
    {
      imageSrc: "https://via.placeholder.com/50/3357FF",
      title: "Will the local team win the championship?",
      items: [
        { name: "Yes", percentage: 80 },
        { name: "No", percentage: 20 },
      ],
      totalAmount: 345678,
    },
    // Multi-option cards (more than two items)
    {
      imageSrc: "https://via.placeholder.com/50/FF33A1",
      title: "Which color do you prefer?",
      items: [
        { name: "Red", percentage: 40 },
        { name: "Blue", percentage: 35 },
        { name: "Green", percentage: 25 },
      ],
      totalAmount: 456789,
    },
    // Multi-option card with two options that are not yes/no
    {
      imageSrc: "https://via.placeholder.com/50/FF33A1",
      title: "Which color do you prefer?",
      items: [
        { name: "Red", percentage: 40 },
        { name: "Blue", percentage: 35 },
      ],
      totalAmount: 456789,
    },
    {
      imageSrc: "https://via.placeholder.com/50/A133FF",
      title: "Which programming language is best?",
      items: [
        { name: "JavaScript", percentage: 50 },
        { name: "Python", percentage: 30 },
        { name: "Java", percentage: 20 },
      ],
      totalAmount: 567890,
    },
    {
      imageSrc: "https://via.placeholder.com/50/33FFA1",
      title: "What is your favorite season?",
      items: [
        { name: "Spring", percentage: 25 },
        { name: "Summer", percentage: 25 },
        { name: "Autumn", percentage: 25 },
        { name: "Winter", percentage: 25 },
      ],
      totalAmount: 678901,
    },
  ];

  return (
    <div className={styles.container}>
      <CardStack cardsData={cardsData} />
    </div>
  );
};

export default MarketsPage;
