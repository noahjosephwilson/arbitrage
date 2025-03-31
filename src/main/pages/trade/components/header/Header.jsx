import React from "react";
import styles from "./Header.module.css";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { FiShare } from "react-icons/fi";

const Header = ({ imageSrc, title }) => {
  return (
    <div className={styles.header}>
      {/* Left: Image */}
      <img src={imageSrc} alt="Header" className={styles.headerImage} />

      {/* Middle: Title */}
      <h1 className={styles.headerTitle}>{title}</h1>

      {/* Right: React Icons */}
      <div className={styles.headerIcons}>
        <FaRegComment className={`${styles.icon} ${styles.commentIcon}`} />
        <FiShare className={`${styles.icon} ${styles.shareIcon}`} />
        <FaRegHeart className={`${styles.icon} ${styles.heartIcon}`} />
      </div>
    </div>
  );
};

export default Header;
