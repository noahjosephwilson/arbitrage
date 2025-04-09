"use client";
import React, { useState } from 'react';
import styles from './FindMarketPage.module.css';

const FindMarketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Name');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = ['Name', 'Number', 'Option'];

  const toggleDropdown = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your search logic.
    console.log(`Searching for "${searchTerm}" by ${selectedOption}`);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={`Search by ${selectedOption}`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className={styles.dropdown}>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={toggleDropdown}
          >
            {selectedOption} ▼
          </button>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {options.map((option) => (
                <li
                  key={option}
                  className={styles.dropdownItem}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </div>
  );
};

export default FindMarketPage;
