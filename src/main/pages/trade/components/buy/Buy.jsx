"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Buy.module.css";

const Buy = () => {
  // State for dynamic market details from DynamoDB.
  const [marketDetails, setMarketDetails] = useState({
    imageURL: "",
    marketName: "",
    choice1: "Choice1",
    choice2: "Choice2",
    choice1Price: 0,
    choice2Price: 0,
  });

  // Separate state for current selected side and buy/sell action.
  const [side, setSide] = useState("choice1"); // default to first choice
  const [buyOrSell, setBuyOrSell] = useState("Buy");

  // Order type dropdown
  const [selectedOrderType, setSelectedOrderType] = useState("Market Order");
  const [showOrderTypeMenu, setShowOrderTypeMenu] = useState(false);
  const orderTypeRef = useRef(null);

  // Fetch market details from DynamoDB on component mount.
  useEffect(() => {
    fetch("/api/market-details/") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMarketDetails(data);
        // Optionally, set the default side to match the fetched choice labels
        setSide(data.choice1.toLowerCase());
      })
      .catch((error) => {
        console.error("Error fetching market details:", error);
      });
  }, []);

  // Close dropdown if click happens outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (orderTypeRef.current && !orderTypeRef.current.contains(event.target)) {
        setShowOrderTypeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Order-specific input states (stored as strings)
  const [marketContracts, setMarketContracts] = useState("");
  const [limitContracts, setLimitContracts] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopContracts, setStopContracts] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  // Helper: Sanitize contracts input to be integer between 1 and 999999999999
  const sanitizeContracts = (value) => {
    let digits = value.replace(/[^\d]/g, "");
    if (!digits) return "";
    let num = parseInt(digits, 10);
    if (isNaN(num)) return "";
    if (num < 1) num = 1;
    if (num > 999999999999) num = 999999999999;
    return String(num);
  };

  // Helper: Sanitize price (in cents) input to be integer between 1 and 99
  const sanitizeCents = (value) => {
    let digits = value.replace(/[^\d]/g, "");
    if (!digits) return "";
    let num = parseInt(digits, 10);
    if (isNaN(num)) return "";
    if (num < 1) num = 1;
    if (num > 99) num = 99;
    return String(num);
  };

  // Helper for Sell orders: Renders one row showing "Estimated Payout:"
  const renderSellInfoRow = (contractsNum, price, isCents = false) => {
    const effectivePrice = isCents ? price / 100 : price;
    return (
      <div className={styles.infoRow}>
        <span>Estimated Payout:</span>
        <span>${(contractsNum * effectivePrice).toFixed(2)}</span>
      </div>
    );
  };

  // Helper for Buy orders: Renders the payout row with profit info
  const renderPayoutRow = (contractsNum, priceCents) => {
    const price = priceCents / 100;
    const estimatedCost = contractsNum * price;
    const totalPayout = contractsNum; // $1 per contract if wins
    const profit = totalPayout - estimatedCost;
    return (
      <div className={styles.infoRow}>
        <span>
          Payout if{" "}
          <span
            className={
              side === "choice1"
                ? styles.yesText
                : styles.noText
            }
          >
            {side === "choice1" ? marketDetails.choice1 : marketDetails.choice2}
          </span>{" "}
          wins:
        </span>
        <span>
          ${totalPayout.toFixed(2)}{" "}
          <span className={styles.profitText}>(+${profit.toFixed(2)})</span>
        </span>
      </div>
    );
  };

  const handleBuy = () => {
    let contracts, priceInfo;
    if (selectedOrderType === "Market Order") {
      contracts = marketContracts;
      priceInfo =
        side === "choice1"
          ? marketDetails.choice1Price
          : marketDetails.choice2Price;
    } else if (selectedOrderType === "Limit Order") {
      contracts = limitContracts;
      priceInfo = limitPrice;
    } else {
      contracts = stopContracts;
      priceInfo = stopPrice;
    }
    alert(
      `${buyOrSell}ing ${contracts} contract(s) for "${
        side === "choice1" ? marketDetails.choice1 : marketDetails.choice2
      }" at price ${priceInfo}`
    );
  };

  // --- MARKET ORDER ---
  const renderMarketOrderSection = () => {
    const currentPrice =
      side === "choice1"
        ? marketDetails.choice1Price
        : marketDetails.choice2Price;
    const contractsNum = parseInt(marketContracts, 10) || 0;
    if (buyOrSell === "Sell") {
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={marketContracts}
              onChange={(e) =>
                setMarketContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span>Estimated Price:</span>
              <span>{Math.round(currentPrice * 100)}¢</span>
            </div>
            <div className={styles.infoRow}>
              <span>Estimated Payout:</span>
              <span>${(contractsNum * currentPrice).toFixed(2)}</span>
            </div>
          </div>
        </>
      );
    } else {
      const estimatedCost = contractsNum * currentPrice;
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={marketContracts}
              onChange={(e) =>
                setMarketContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span>Estimated Price:</span>
              <span>{Math.round(currentPrice * 100)}¢</span>
            </div>
            <div className={styles.infoRow}>
              <span>Estimated Cost:</span>
              <span>${estimatedCost.toFixed(2)}</span>
            </div>
            {renderPayoutRow(contractsNum, Math.round(currentPrice * 100))}
          </div>
        </>
      );
    }
  };

  // --- LIMIT ORDER ---
  const renderLimitOrderSection = () => {
    const contractsNum = parseInt(limitContracts, 10) || 0;
    const priceCents = parseInt(limitPrice, 10) || 0;
    if (buyOrSell === "Sell") {
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={limitContracts}
              onChange={(e) =>
                setLimitContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Limit Price</span>
            <div className={styles.centsInputContainer}>
              <input
                type="text"
                className={styles.centsInput}
                value={limitPrice}
                onChange={(e) => setLimitPrice(sanitizeCents(e.target.value))}
                placeholder=""
              />
              {limitPrice === "" ? (
                <span className={styles.centsSymbolGray}>0¢</span>
              ) : (
                <span className={styles.centsSymbol}>¢</span>
              )}
            </div>
          </label>
          <div className={styles.infoSection}>
            {renderSellInfoRow(contractsNum, priceCents, true)}
          </div>
        </>
      );
    } else {
      const price = priceCents / 100;
      const estimatedCost = contractsNum * price;
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={limitContracts}
              onChange={(e) =>
                setLimitContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Limit price</span>
            <div className={styles.centsInputContainer}>
              <input
                type="text"
                className={styles.centsInput}
                value={limitPrice}
                onChange={(e) => setLimitPrice(sanitizeCents(e.target.value))}
                placeholder=""
              />
              {limitPrice === "" ? (
                <span className={styles.centsSymbolGray}>0¢</span>
              ) : (
                <span className={styles.centsSymbol}>¢</span>
              )}
            </div>
          </label>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span>Estimated Cost:</span>
              <span>${estimatedCost.toFixed(2)}</span>
            </div>
            {renderPayoutRow(contractsNum, priceCents)}
          </div>
        </>
      );
    }
  };

  // --- STOP ORDER ---
  const renderStopOrderSection = () => {
    const contractsNum = parseInt(stopContracts, 10) || 0;
    const priceCents = parseInt(stopPrice, 10) || 0;
    if (buyOrSell === "Sell") {
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={stopContracts}
              onChange={(e) =>
                setStopContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Stop Price</span>
            <div className={styles.centsInputContainer}>
              <input
                type="text"
                className={styles.centsInput}
                value={stopPrice}
                onChange={(e) => setStopPrice(sanitizeCents(e.target.value))}
                placeholder=""
              />
              {stopPrice === "" ? (
                <span className={styles.centsSymbolGray}>0¢</span>
              ) : (
                <span className={styles.centsSymbol}>¢</span>
              )}
            </div>
          </label>
          <div className={styles.infoSection}>
            {renderSellInfoRow(contractsNum, priceCents, true)}
          </div>
        </>
      );
    } else {
      const price = priceCents / 100;
      const estimatedCost = contractsNum * price;
      return (
        <>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Contracts</span>
            <input
              type="text"
              className={styles.inputField}
              value={stopContracts}
              onChange={(e) =>
                setStopContracts(sanitizeContracts(e.target.value))
              }
              placeholder="0"
            />
          </label>
          <label className={styles.inputRow}>
            <span className={styles.inputLabel}>Stop Price</span>
            <div className={styles.centsInputContainer}>
              <input
                type="text"
                className={styles.centsInput}
                value={stopPrice}
                onChange={(e) => setStopPrice(sanitizeCents(e.target.value))}
                placeholder=""
              />
              {stopPrice === "" ? (
                <span className={styles.centsSymbolGray}>0¢</span>
              ) : (
                <span className={styles.centsSymbol}>¢</span>
              )}
            </div>
          </label>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span>Estimated Cost:</span>
              <span>${estimatedCost.toFixed(2)}</span>
            </div>
            {renderPayoutRow(contractsNum, priceCents)}
          </div>
        </>
      );
    }
  };

  // Decide which order section to render
  const renderOrderSection = () => {
    switch (selectedOrderType) {
      case "Market Order":
        return renderMarketOrderSection();
      case "Limit Order":
        return renderLimitOrderSection();
      case "Stop Order":
        return renderStopOrderSection();
      default:
        return renderMarketOrderSection();
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <img
          src={marketDetails.imageURL || "/default-avatar.jpg"}
          alt="Market avatar"
          className={styles.avatar}
        />
        <div className={styles.titleWrapper}>
          <div className={styles.questionTitle}>
            {marketDetails.marketName || "Market Name"}
          </div>
          <div
            className={styles.subTitle}
            style={{
              color: side === "choice1" ? "#00c28e" : "#dc3545",
            }}
          >
            {buyOrSell}{" "}
            {side === "choice1" ? marketDetails.choice1 : marketDetails.choice2}
          </div>
        </div>
      </div>

      {/* Buy/Sell & Order Type Row */}
      <div className={styles.buySellRow}>
        <div className={styles.buySellButtons}>
          <span
            className={`${styles.buySellOption} ${
              buyOrSell === "Buy" ? styles.activeOption : ""
            }`}
            onClick={() => setBuyOrSell("Buy")}
          >
            Buy
          </span>
          <span
            className={`${styles.buySellOption} ${
              buyOrSell === "Sell" ? styles.activeOption : ""
            }`}
            onClick={() => setBuyOrSell("Sell")}
          >
            Sell
          </span>
        </div>
        <div
          className={styles.orderTypeDropdownContainer}
          ref={orderTypeRef}
        >
          <div
            className={`${styles.orderTypeDropdown} ${
              showOrderTypeMenu ? styles.activeOption : ""
            }`}
            onClick={() => setShowOrderTypeMenu(!showOrderTypeMenu)}
          >
            {selectedOrderType}
            <span className={styles.caret}>▼</span>
          </div>
          <div
            className={`${styles.orderTypeMenu} ${
              showOrderTypeMenu ? styles.show : ""
            }`}
          >
            <div
              className={styles.orderTypeMenuItem}
              onClick={() => {
                setSelectedOrderType("Market Order");
                setShowOrderTypeMenu(false);
              }}
            >
              Market Order
            </div>
            <div
              className={styles.orderTypeMenuItem}
              onClick={() => {
                setSelectedOrderType("Limit Order");
                setShowOrderTypeMenu(false);
              }}
            >
              Limit Order
            </div>
            <div
              className={styles.orderTypeMenuItem}
              onClick={() => {
                setSelectedOrderType("Stop Order");
                setShowOrderTypeMenu(false);
              }}
            >
              Stop Order
            </div>
          </div>
        </div>
      </div>

      {/* Pick a side */}
      <div className={styles.pickSideRow}>
        <span className={styles.pickSideLabel}>Pick a side</span>
        <span title="More info about picking a side"></span>
      </div>

      {/* Side Selection */}
      <div className={styles.sideSelection}>
        <button
          className={`${styles.sideButton} ${
            side === "choice1" ? styles.activeYes : styles.inactiveYes
          }`}
          onClick={() => setSide("choice1")}
        >
          {marketDetails.choice1}{" "}
          {Math.round(marketDetails.choice1Price * 100)}¢
        </button>
        <button
          className={`${styles.sideButton} ${
            side === "choice2" ? styles.activeNo : styles.inactiveNo
          }`}
          onClick={() => setSide("choice2")}
        >
          {marketDetails.choice2}{" "}
          {Math.round(marketDetails.choice2Price * 100)}¢
        </button>
      </div>

      {/* Render the appropriate order section */}
      {renderOrderSection()}

      {/* Action Button */}
      <button
        className={`${styles.actionButton} ${
          side === "choice1" ? styles.greenButton : styles.redButton
        }`}
        onClick={handleBuy}
      >
        {buyOrSell}
      </button>
    </div>
  );
};

export default Buy;
