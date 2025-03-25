import React from "react";
import styles from "./Header.module.css";
import { FaRegComment, FaRegShareSquare, FaRegHeart } from "react-icons/fa";

const Header = ({ imageSrc, title }) => {
  return (
    <div className={styles.header}>
      {/* Left: Image */}
      <img src={imageSrc} alt="Header" className={styles.headerImage} />

      {/* Middle: Title */}
      <h1 className={styles.headerTitle}>{title}</h1>

      {/* Right: React Icons */}
      <div className={styles.headerIcons}>
        <FaRegComment className={styles.icon} />
        <FaRegShareSquare className={styles.icon} />
        <FaRegHeart className={styles.icon} />
      </div>
    </div>
  );
};

export default Header;
