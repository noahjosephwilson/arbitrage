"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./MarketsPage.module.css";
import { FaPlusCircle, FaCheckCircle, FaEdit, FaSearch } from "react-icons/fa";
import Flagged from "./components/flagged/Flagged";

interface Action {
  label: string;
  icon: React.ReactNode;
  className: string;
  go: (router: ReturnType<typeof useRouter>) => void;
}

/* ─────────── Action definitions ─────────── */
const ACTIONS: Action[] = [
  {
    label: "Create Market",
    icon: <FaPlusCircle />,
    className: styles.createButton,
    go: (r) => r.push("/admin/markets/createsimplemarket"),
  },
  {
    label: "Resolve Market",
    icon: <FaCheckCircle />,
    className: styles.resolveButton,
    go: (r) => r.push("/admin/markets/findmarket"),
  },
  {
    label: "Modify Market",
    icon: <FaEdit />,
    className: styles.modifyButton,
    go: (r) => r.push("/modify-market"),
  },
  {
    label: "Search Market",
    icon: <FaSearch />,
    className: styles.viewButton,
    go: (r) => r.push("/search-market"),
  },
];

const MarketsPage: React.FC = () => {
  const router = useRouter();

  return (
    <section className={styles.wrapper}>
      {/* Page heading */}
      <header className={styles.header}>
        <h1 className={styles.title}>Market Console</h1>
        <p className={styles.subtitle}>
          Create, resolve, modify, or search markets. Any items awaiting review
          appear below.
        </p>
      </header>

      {/* Action buttons */}
      <div className={styles.buttonGrid}>
        {ACTIONS.map(({ label, icon, className, go }) => (
          <button
            key={label}
            aria-label={label}
            className={`${styles.actionButton} ${className}`}
            onClick={() => go(router)}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Flagged markets/cards */}
      <Flagged />
    </section>
  );
};

export default MarketsPage; 