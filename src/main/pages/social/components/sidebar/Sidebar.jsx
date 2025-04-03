import React from 'react';
import styles from './Sidebar.module.css';
// Import Lucide React icons (update the icon names as needed)
import {
  Home,
  MessageSquare,
  Bookmark,
  User,
  FileText,
  LifeBuoy,
  HelpCircle,
} from 'lucide-react';

function Sidebar() {
  return (
    <aside className={styles.sidebarContainer}>
      {/* Header / Branding */}
      <div className={styles.header}>
        <h1 className={styles.title}>Social</h1>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {/* Home */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <Home size={36} />
            </span>
            Profile
          </li>

          {/* Replies */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <MessageSquare size={36} />
            </span>
            Comments
          </li>

          {/* Bookmarks */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <Bookmark size={36} />
            </span>
            Market Builder
          </li>

          {/* Profile */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <User size={36} />
            </span>
            Leaderboard
          </li>

          {/* Community Guidelines */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <FileText size={36} />
            </span>
            Community Guidelines
          </li>

          {/* Support */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <LifeBuoy size={36} />
            </span>
            Support
          </li>

          {/* FAQs */}
          <li className={styles.navItem}>
            <span className={styles.navIcon}>
              <HelpCircle size={36} />
            </span>
            FAQs
          </li>
        </ul>
      </nav>

      {/* Post Button */}
      <button className={styles.postButton}>Post</button>
    </aside>
  );
}

export default Sidebar;
