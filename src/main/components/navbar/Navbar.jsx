"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdLeaderboard } from 'react-icons/md';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import styles from './Navbar.module.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClear = () => {
    setSearchValue('');
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

  const handleLogout = async () => {
    await signOut(auth);
    setShowMenu(false);
    router.push('/'); // Redirect as needed after logout
  };

  return (
    <nav className={styles.navbar}>
      {/* Left Section: Logo and Navigation Links */}
      <div className={styles.leftSection}>
        <Link href="/main/logo">
          <span className={styles.logo}>Arbitrage</span>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/main/markets/all" onClick={handleMarketsClick}>
              Markets
            </Link>
          </li>
          <li>
            <Link href="/main/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link href="/main/create">Create</Link>
          </li>
        </ul>
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
          <div 
            className={styles.iconButton} 
            onClick={() => setShowMenu(!showMenu)}
          >
            <AiOutlineMenu className={styles.hamburgerIcon} />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className={styles.mobileMenu}>
          <ul>
            <li>
              <Link href="/main/markets/all" onClick={() => setShowMenu(false)}>
                Markets
              </Link>
            </li>
            <li>
              <Link href="/main/portfolio" onClick={() => setShowMenu(false)}>
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/main/create" onClick={() => setShowMenu(false)}>
                Create
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <button onClick={handleAddFunds}>Add Funds</button>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
