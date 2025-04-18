"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdLeaderboard } from 'react-icons/md';
import { useRouter, usePathname } from 'next/navigation';
import Submenu from './components/submenu/Submenu'; // Adjust path if needed
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchBarStack, setShowSearchBarStack] = useState(false);

  // For navigation
  const router = useRouter();
  const pathname = usePathname();

  // Ref to detect clicks outside the hamburger + submenu
  const hamburgerWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hamburgerWrapperRef.current &&
        !hamburgerWrapperRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleClear = () => {
    setSearchValue('');
    setShowSearchBarStack(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowSearchBarStack(value.length > 0);
  };

  const handleMarketsClick = (e) => {
    if (pathname.startsWith('/main/markets')) {
      e.preventDefault();
      router.push('/main/markets/all');
    }
  };

  const handleAddFunds = () => {
    router.push('/add-funds');
    setShowMenu(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left Section: Logo and Navigation Links */}
        <div className={styles.leftSection}>
          <Link href="/main/logo">
            <span className={styles.logo}>Arbitrage</span>
          </Link>
          <div className={styles.navLinksContainer}>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/main/markets/all" onClick={handleMarketsClick}>
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/main/portfolio/positions">Portfolio</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section: Search, Auth Buttons, and Icons */}
        <div className={styles.rightSection}>
        <div className={styles.searchWrapper}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search markets"
            className={styles.searchInput}
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchBarStack(true)}
          />
          {searchValue && (
            <AiOutlineClose
              className={styles.clearIcon}
              onClick={handleClear}
            />
          )}

    {showSearchBarStack && (
      <div className={styles.searchBarStack}>
        <div className={styles.searchBarCard}>
          <img src="/sample1.png" alt="" className={styles.cardImage} />
          <span className={styles.cardText}>Example #1</span>
          <span className={styles.cardNumber}>40%</span>
        </div>
        <div className={styles.searchBarCard}>
          <img src="/sample2.png" alt="" className={styles.cardImage} />
          <span className={styles.cardText}>Example #2</span>
          <span className={styles.cardNumber}>60%</span>
        </div>
        <div className={styles.searchBarCard}>
          <img src="/sample3.png" alt="" className={styles.cardImage} />
          <span className={styles.cardText}>Example #3</span>
          <span className={styles.cardNumber}>80%</span>
        </div>
      </div>
    )}

        </div>


          <div className={styles.authButtons}>
            {/* The Add Funds button is now always shown */}
            <button onClick={handleAddFunds} className={styles.addFundsBtn}>
              Add Funds
            </button>
          </div>

          <div className={styles.hamburgerContainer}>
            <Link href="/leaderboard">
              <div className={styles.iconButton}>
                <MdLeaderboard className={styles.leaderboardIcon} />
              </div>
            </Link>

            <div className={styles.hamburgerWrapper} ref={hamburgerWrapperRef}>
              <div
                className={styles.iconButton}
                onClick={() => setShowMenu(!showMenu)}
              >
                <AiOutlineMenu className={styles.hamburgerIcon} />
              </div>

              {showMenu && (
                <Submenu
                  onClose={() => setShowMenu(false)}
                  handleAddFunds={handleAddFunds}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
