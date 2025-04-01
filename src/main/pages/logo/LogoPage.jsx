"use client";
import React from 'react';
import styles from './LogoPage.module.css';
import Graph from './components/graph/Graph';
import Positionsandwatchlist from './components/positionsandwatchlist/Positionsandwatchlist';
import Todo from './components/todo/Todo';
import NewsStack from './components/NewsStack/NewsStack';

export default function LogoPage() {
  const handleNextTodo = () => {
    // Implement the logic to show the next Todo
    console.log("Show next Todo");
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.graphWrapper}>
          <div className={styles.graphTodoWrapper}>
            <Graph />
            <Todo 
              title="Setup Account"
              description="You still need to setup your account with personal information"
              buttonText="Show More"
              pagination="3/7"
              imageUrl="https://via.placeholder.com/50"
              onNextTodo={handleNextTodo}
            />
            <div className={styles.newsStackContainer}>
              <NewsStack />
            </div>
          </div>
        </div>
        <div className={styles.positionsWrapper}>
          <Positionsandwatchlist />
        </div>
      </div>
    </div>
  );
}
