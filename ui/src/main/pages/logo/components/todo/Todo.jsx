import React from 'react';
import styles from './Todo.module.css';

const Todo = ({
  title = 'Default Title',
  description = 'Default description text goes here.',
  buttonText = 'Default Button',
  pagination = '1/1', // e.g. "3/7"
  imageUrl,
  onNextTodo, // callback when clicking the "X" button
}) => {
  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoHeader}>
        {imageUrl && (
          <img
            className={styles.todoImage}
            src={imageUrl}
            alt="Todo visual"
          />
        )}
        <h2 className={styles.todoTitle}>{title}</h2>
      </div>
      <div className={styles.todoBody}>
        <p className={styles.todoDescription}>{description}</p>
      </div>
      <div className={styles.todoFooter}>
        <button className={styles.todoButton}>{buttonText}</button>
      </div>
      {/* Close button in the top right corner */}
      <button className={styles.closeButton} onClick={onNextTodo}>
        X
      </button>
      {/* Pagination indicator in the bottom right corner */}
      <span className={styles.paginationIndicator}>{pagination}</span>
    </div>
  );
};

export default Todo;
