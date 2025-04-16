import React from "react";
import Filter from "./components/filter/Filter";
import styles from "./PositionsPage.module.css";

const PositionsPage = () => {
  return (
    <>
      {/* Render the Filter outside the container */}
      <Filter />

      {/* Main page container for the rest of the content */}
      <div className={styles.container}>
        <h1 className={styles.title}>Available Positions</h1>
        {/* ...other content... */}
      </div>
    </>
  );
};

export default PositionsPage;
