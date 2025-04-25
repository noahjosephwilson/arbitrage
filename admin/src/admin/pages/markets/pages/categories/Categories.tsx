"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Categories.module.css';

// Replace with your actual API Gateway endpoint URL.
const API_URL = "https://lxqyajwdrd.execute-api.us-east-1.amazonaws.com/dev/readcategories";

interface Category {
  "Primary Name": string;
  "Primary ID": string | { [key: string]: number };
  "Secondary Categories"?: SecondaryCategory[];
}

interface SecondaryCategory {
  "Secondary Name": string;
  "Secondary ID": string | { [key: string]: number };
}

/**
 * Converts an object representation of binary bytes into a 16-byte hex string.
 */
function objectIdToHex(obj: { [key: string]: number }): string {
  let bytes: number[] = [];
  for (let i = 0; i < 16; i++) {
    const key = i.toString();
    let byteVal = obj.hasOwnProperty(key) ? obj[key] : 0;
    bytes.push(byteVal & 0xff);
  }
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * If idValue is a string, we assume it's already in Base64.
 * Otherwise, if it's an object, we convert it to a hex string.
 */
function getDisplayId(idValue: string | { [key: string]: number }): string {
  if (typeof idValue === "string") {
    return idValue;
  } else if (typeof idValue === "object" && idValue !== null) {
    return objectIdToHex(idValue);
  }
  return String(idValue);
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dropdown states.
  const [activeMenu, setActiveMenu] = useState<'primary' | 'secondary' | null>(null);
  const [selectedPrimary, setSelectedPrimary] = useState<Category | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<SecondaryCategory | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        let categoriesFromAPI: Category[] | null = null;
        if (data && data["Primary Categories"]) {
          categoriesFromAPI = data["Primary Categories"];
        } else if (Array.isArray(data)) {
          categoriesFromAPI = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          categoriesFromAPI = data.data;
        }
        
        if (categoriesFromAPI) {
          setCategories(categoriesFromAPI);
        } else {
          throw new Error("Categories not found in API response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Close dropdown if clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: 'primary' | 'secondary') => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const handlePrimarySelect = (primary: Category) => {
    setSelectedPrimary(primary);
    setSelectedSecondary(null);
    setActiveMenu(null);
  };

  const handleSecondarySelect = (secondary: SecondaryCategory) => {
    setSelectedSecondary(secondary);
    setActiveMenu(null);
  };

  const renderPrimaryMenu = () => (
    <div className={styles.dropdownMenu}>
      {categories.map((primary, idx) => (
        <div
          key={idx}
          className={styles.dropdownItem}
          onClick={() => handlePrimarySelect(primary)}
        >
          {primary["Primary Name"]}
        </div>
      ))}
    </div>
  );

  const renderSecondaryMenu = () => {
    if (!selectedPrimary) return null;
    return (
      <div className={styles.dropdownMenu}>
        {selectedPrimary["Secondary Categories"] &&
          selectedPrimary["Secondary Categories"].map((secondary, idx) => (
            <div
              key={idx}
              className={styles.dropdownItem}
              onClick={() => handleSecondarySelect(secondary)}
            >
              {secondary["Secondary Name"]}
            </div>
          ))}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.container}><p>Loading categories...</p></div>;
  }
  if (error) {
    return <div className={styles.container}><p>Error: {error}</p></div>;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <h1 className={styles.header}>Categories Admin Page</h1>
      <div className={styles.actions}>
        {/* Button to navigate to Modify Categories page */}
        <Link href="/admin/markets/modifycategories">
          <button className={styles.modifyButton}>Modify Categories</button>
        </Link>
      </div>
      <div className={styles.card}>
        <div className={styles.dropdownContainer}>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => toggleMenu('primary')}
            >
              {selectedPrimary ? selectedPrimary["Primary Name"] : 'Select Primary Category'}
            </button>
            {activeMenu === 'primary' && renderPrimaryMenu()}
          </div>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => toggleMenu('secondary')}
              disabled={!selectedPrimary}
            >
              {selectedSecondary ? selectedSecondary["Secondary Name"] : 'Select Secondary Category'}
            </button>
            {activeMenu === 'secondary' && selectedPrimary && renderSecondaryMenu()}
          </div>
        </div>
        {selectedPrimary && selectedSecondary && (
          <div className={styles.details}>
            <h2>Selected Category IDs</h2>
            <p>
              <strong>Primary Category ID:</strong>{" "}
              {getDisplayId(selectedPrimary["Primary ID"])}
            </p>
            <p>
              <strong>Secondary Category ID:</strong>{" "}
              {getDisplayId(selectedSecondary["Secondary ID"])}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories; 