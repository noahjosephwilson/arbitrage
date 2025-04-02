"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  { name: 'Tech' },
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
  Tech: '/main/markets/tech',
  Health: '/main/markets/health',
  World: '/main/markets/world',
};

function Subnavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const matchingCategory = Object.keys(routes).find(
      (category) => routes[category] === pathname
    );
    if (matchingCategory) {
      setActiveCategory(matchingCategory);
    } else {
      setActiveCategory("All");
    }
  }, [pathname]);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    const route = routes[categoryName];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className={styles.subnavbar}>
      <div className={styles.subnavbarContent}>
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
        <div className={styles.fullWidthLine}></div>
      </div>
    </div>
  );
}

export default Subnavbar;
