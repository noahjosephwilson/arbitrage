"use client";
import React from "react";
import Link from "next/link";
import styles from "./Submenu.module.css";
import { signOut } from "aws-amplify/auth";

const Submenu = ({ user, onClose, handleAddFunds }) => {
  const handleLogout = async () => {
    try {
      await signOut({ global: true }); // Sign out everywhere
      console.log("User signed out successfully.");
  
      try {
        const userAfterLogout = await getCurrentUser();
        console.log("User still signed in after logout:", userAfterLogout);
      } catch (error) {
        console.log("No user signed in after logout (expected):", error);
      }
  
      window.location.href = "/landing"; // Force full reload to clear session
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  

  // Icons with custom CSS classes for separate sizing
  const trophyIcon = (
    <svg
      className={styles.trophyIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 5h4v7a4 4 0 0 1-4-4V5" />
      <path d="M22 5h-4v7a4 4 0 0 0 4-4V5" />
      <path d="M18 10a6 6 0 0 1-12 0V5h12z" />
      <path d="M12 15v7" />
      <path d="M9 22h6" />
    </svg>
  );

  const plusCircleIcon = (
    <svg
      className={styles.plusCircleIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  const giftIcon = (
    <svg
      className={styles.giftIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7h-2a2 2 0 1 1 2-2v2z" />
      <path d="M12 7h2a2 2 0 1 0-2-2v2z" />
    </svg>
  );

  // Top row items (icon above label)
  const topItems = [
    { label: "Leaderboard", icon: trophyIcon, link: "/leaderboard" },
    { label: "Add funds", icon: plusCircleIcon, onClick: handleAddFunds },
    { label: "Invite friends", icon: giftIcon, link: "/invite" },
  ];

  // Bottom list items (links or buttons)
  const bottomItems = [
    { label: "Account & security", link: "/account" },
    { label: "Your activity", link: "/activity" },
    { label: "Transfers", link: "/transfers" },
    { label: "Documents", link: "/documents" },
    { label: "API Docs", link: "/api-docs" },
    { label: "Settings", link: "/settings" },
    { label: "Help", link: "/help" },
    { label: "Log out", onClick: handleLogout },
  ];

  // Render top-row item
  const renderTopItem = (item, idx) => {
    const content = (
      <div className={styles.topItem}>
        <div className={styles.iconCircle}>{item.icon}</div>
        <span className={styles.topItemLabel}>{item.label}</span>
      </div>
    );

    if (item.onClick) {
      return (
        <button
          key={idx}
          className={styles.topRowButton}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {content}
        </button>
      );
    } else {
      return (
        <Link key={idx} href={item.link} className={styles.topRowButton} onClick={onClose}>
          {content}
        </Link>
      );
    }
  };

  // Render bottom list item
  const renderBottomItem = (item, idx) => {
    if (item.onClick) {
      return (
        <button
          key={idx}
          className={styles.menuItem}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      );
    } else if (item.link) {
      return (
        <Link key={idx} href={item.link} className={styles.menuItem} onClick={onClose}>
          {item.label}
        </Link>
      );
    } else {
      return (
        <button key={idx} className={styles.menuItem} onClick={onClose}>
          {item.label}
        </button>
      );
    }
  };

  return (
    <div className={styles.submenu}>
      {/* Top row */}
      <div className={styles.topRow}>
        {topItems.map((item, idx) => renderTopItem(item, idx))}
      </div>

      <hr className={styles.divider} />

      {/* Bottom list */}
      <div className={styles.bottomList}>
        {bottomItems.map((item, idx) => renderBottomItem(item, idx))}
      </div>
    </div>
  );
};

export default Submenu;
