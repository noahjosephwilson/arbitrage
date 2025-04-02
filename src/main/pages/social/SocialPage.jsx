"use client";

import React, { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar'; // Adjust the import path as needed
import styles from './SocialPage.module.css';

const SocialPage = () => {
  const [marketName, setMarketName] = useState("");
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState([""]);

  const handleAddOutcome = () => {
    setOutcomes([...outcomes, ""]);
  };

  const handleOutcomeChange = (index, value) => {
    const updatedOutcomes = [...outcomes];
    updatedOutcomes[index] = value;
    setOutcomes(updatedOutcomes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission (e.g., send to an API endpoint)
    console.log("Creating betting market:", { marketName, description, outcomes });
    // Reset the form fields after submission
    setMarketName("");
    setDescription("");
    setOutcomes([""]);
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Create New Betting Market</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Market Name:
            <input
              type="text"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              className={styles.input}
              placeholder="Enter market name"
              required
            />
          </label>
          <label className={styles.label}>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Enter market description"
              required
            />
          </label>
          <div className={styles.outcomesSection}>
            <label className={styles.label}>Outcomes:</label>
            {outcomes.map((outcome, index) => (
              <input
                key={index}
                type="text"
                value={outcome}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                className={styles.input}
                placeholder={`Outcome ${index + 1}`}
                required
              />
            ))}
            <button type="button" onClick={handleAddOutcome} className={styles.addButton}>
              Add Outcome
            </button>
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Market
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialPage;
