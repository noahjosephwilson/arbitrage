"use client";

import React, { useState } from "react";
import styles from "./Card.module.css";

export default function Card({
  imageSrc,
  title,
  defaultOrderID,
  defaultMarketID,
  defaultOptionID,
}) {
  const [order, setOrder] = useState({
    OrderID: defaultOrderID || "",
    MarketID: defaultMarketID || "",
    OptionID: defaultOptionID || "",
    All_Or_Nothing: false,
    Quantity: 0,
    Remaining_Quantity: 0,
    Order_Type: "LIMIT",
    Price: 0.0,
    Status: "PENDING",
    Order_Timestamp: "",
    Last_Updated_Timestamp: "",
    Time_In_Force: "GTC",
    Order_Expiration: "",
  });

  const updateField = (field, value) => {
    setOrder((o) => ({ ...o, [field]: value }));
  };

  const handleSubmit = async () => {
    const now = new Date().toISOString();
    const payload = {
      ...order,
      Order_Timestamp: now,
      Last_Updated_Timestamp: now,
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("Order accepted:", data);
      updateField("Status", data.status || "ACCEPTED");
    } catch (err) {
      console.error("Order submission failed:", err);
      updateField("Status", "FAILED");
    }
  };

  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={title} className={styles.image} />
      <h3>{title}</h3>

      <label>
        Quantity:
        <input
          type="number"
          value={order.Quantity}
          onChange={(e) => updateField("Quantity", Number(e.target.value))}
        />
      </label>

      <label>
        Price:
        <input
          type="number"
          step="0.01"
          value={order.Price}
          onChange={(e) => updateField("Price", parseFloat(e.target.value))}
        />
      </label>

      <label>
        All‑Or‑Nothing:
        <input
          type="checkbox"
          checked={order.All_Or_Nothing}
          onChange={(e) => updateField("All_Or_Nothing", e.target.checked)}
        />
      </label>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Submit Order
      </button>

      <p>Status: {order.Status}</p>
    </div>
  );
}
