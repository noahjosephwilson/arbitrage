"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Subnavbar.module.css';

const categoryData = [
  { name: 'All' },
  { name: 'Politics' },
  { name: 'Sports' },
  { name: 'Culture' },
  { name: 'Crypto' },
  { name: 'Climate' },
  { name: 'Economics' },
  { name: 'Companies' },
  { name: 'Financials' },
  { name: 'Tech & Science' },
  { name: 'Health' },
  { name: 'World' },
];

const routes = {
  All: '/main/markets/all',
  Politics: '/main/markets/politics',
  Sports: '/main/markets/sports',
  Culture: '/main/markets/culture',
  Crypto: '/main/markets/crypto',
  Climate: '/main/markets/climate',
  Economics: '/main/markets/economics',
  Companies: '/main/markets/companies',
  Financials: '/main/markets/financials',
  "Tech & Science": '/main/markets/tech',
  Health: '/main/markets/health',
  World: '/main/markets/world',
};

function Subnavbar() {
  const [activeCategory, setActiveCategory] = useState(categoryData[0].name);
  const router = useRouter();

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    const route = routes[categoryName];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className={styles.subnavbar}>
      {/* Top row: Main Categories */}
      <div className={styles.topRow}>
        {categoryData.map((category) => (
          <button
            key={category.name}
            className={`${styles.topRowItem} ${
              activeCategory === category.name ? styles.activeCategory : ''
            }`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Subnavbar;
