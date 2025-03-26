"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdLeaderboard } from 'react-icons/md';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Submenu from './components/submenu/Submenu'; // Adjust path if needed
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  // For navigation
  const router = useRouter();
  const pathname = usePathname();

  // Ref to detect clicks outside the hamburger + submenu
  const hamburgerWrapperRef = useRef(null);

  useEffect(() => {
    // Listen for clicks outside the hamburgerWrapper when submenu is open
    function handleClickOutside(event) {
      if (
        hamburgerWrapperRef.current &&
        !hamburgerWrapperRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup on unmount or when showMenu changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClear = () => setSearchValue('');

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

  const handleLogout = async () => {
    await signOut(auth);
    setShowMenu(false);
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
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
            <li>
              <Link href="/main/social">Social</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section: Search and Icons */}
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search markets"
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <AiOutlineClose 
              className={styles.clearIcon}
              onClick={handleClear}
            />
          )}
        </div>
        <div className={styles.authButtons}>
          {user && (
            <button onClick={handleAddFunds} className={styles.addFundsBtn}>
              Add Funds
            </button>
          )}
        </div>

        <div className={styles.hamburgerContainer}>
          <Link href="/leaderboard">
            <div className={styles.iconButton}>
              <MdLeaderboard className={styles.leaderboardIcon} />
            </div>
          </Link>

          {/* IMPORTANT: Attach the ref here so we can detect outside clicks */}
          <div
            className={styles.hamburgerWrapper}
            ref={hamburgerWrapperRef}
          >
            <div
              className={styles.iconButton}
              onClick={() => setShowMenu(!showMenu)}
            >
              <AiOutlineMenu className={styles.hamburgerIcon} />
            </div>

            {showMenu && (
              <Submenu
                user={user}
                onClose={() => setShowMenu(false)}
                handleAddFunds={handleAddFunds}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
