"use client";

import React, { useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import styles from "./LogoPage.module.css";
import Graph from "./components/graph/graph";
import Positionsandwatchlist from "./components/positionsandwatchlist/Positionsandwatchlist";
import Todo from "./components/todo/Todo";
import NewsStack from "./components/newsstack/NewsStack";

export default function LogoPage() {
  useEffect(() => {

    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        console.log("Fetched user:", user);
        // No setting email or anything — just confirming the user is signed in
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    fetchUser();
  }, []);

  const handleNextTodo = () => {
    console.log("Show next Todo");
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.contentWrapper}>
        {/* Removed the userInfo section */}

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
