"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import styles from './FindMarketPage.module.css';

const FindMarketPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('Name');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const options: string[] = ['Name', 'Number', 'Option'];

  const toggleDropdown = (): void => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleOptionSelect = (option: string): void => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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