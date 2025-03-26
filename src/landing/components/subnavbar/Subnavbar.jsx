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
  { name: 'Tech & Science' },
  { name: 'Health' },
  { name: 'World' },
];

const routes = {
  All: '/landing/landingmarkets/all',
  Politics: '/landing/landingmarkets/politics',
  Sports: '/landing/landingmarkets/sports',
  Culture: '/landing/landingmarkets/culture',
  Crypto: '/landing/landingmarkets/crypto',
  Climate: '/landing/landingmarkets/climate',
  Economics: '/landing/landingmarkets/economics',
  Companies: '/landing/landingmarkets/companies',
  Financials: '/landing/landingmarkets/financials',
  "Tech & Science": '/landing/landingmarkets/tech',
  Health: '/landing/landingmarkets/health',
  World: '/landing/landingmarkets/world',
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
      {/* Optional: Include a full-width line if desired */}
      <div className={styles.fullWidthLine}></div>
    </div>
  );
}

export default Subnavbar;
