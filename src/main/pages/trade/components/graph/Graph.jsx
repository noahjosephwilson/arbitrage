"use client";

import React, { useMemo, useState } from "react";
import styles from "./Graph.module.css";

export default function Graph({
  datasets = {},
  currentChance = 84,
  delta = -0.4,
}) {
  // Overall SVG dimensions and margins
  const width = 600;
  const height = 300;
  const margin = { top: 10, right: 40, bottom: 20, left: 20 };

  // Available time ranges
  const availableRanges = ["6H", "1D", "1W", "1M", "ALL"];
  // Default to "ALL" so that sample data spanning months is visible initially.
  const [selectedRange, setSelectedRange] = useState("ALL");

  // Get the dataset for the current selected range (or empty array if not provided)
  const currentData = datasets[selectedRange] || [];

  // Process current data: convert date strings to timestamps and sort chronologically
  const processedData = useMemo(() => {
    return currentData
      .map((d) => ({
        ...d,
        timestamp: new Date(d.date).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [currentData]);

  // Map processed data into plotting points { x, y }
  const sortedData = useMemo(() => {
    return processedData.map((d) => ({
      x: d.timestamp,
      y: d.value,
    }));
  }, [processedData]);

  // Compute dynamic x-domain
  const minX = sortedData.length ? sortedData[0].x : 0;
  const maxX = sortedData.length ? sortedData[sortedData.length - 1].x : 1;

  // Compute dynamic y-domain (fallback to 0–1)
  let minY = sortedData.length ? Math.min(...sortedData.map((d) => d.y)) : 0;
  let maxY = sortedData.length ? Math.max(...sortedData.map((d) => d.y)) : 1;
  if (minY === maxY) {
    minY -= 0.05;
    maxY += 0.05;
  }
  const yRange = maxY - minY;
  minY -= yRange * 0.05;
  maxY += yRange * 0.05;

  // Scale functions: data values -> SVG coordinates
  const scaleX = (val) => {
    if (maxX === minX) return margin.left;
    const usableWidth = width - margin.left - margin.right;
    return margin.left + ((val - minX) / (maxX - minX)) * usableWidth;
  };

  const scaleY = (val) => {
    if (maxY === minY) return height - margin.bottom;
    const usableHeight = height - margin.top - margin.bottom;
    return height - margin.bottom - ((val - minY) / (maxY - minY)) * usableHeight;
  };

  // Build the SVG path for the red line
  const linePath = useMemo(() => {
    if (!sortedData.length) return "";
    return sortedData
      .map((point, i) => {
        const x = scaleX(point.x);
        const y = scaleY(point.y);
        return i === 0 ? `M${x},${y}` : `L${x},${y}`;
      })
      .join(" ");
  }, [sortedData]);

  // Create axis ticks (5 ticks for each axis)
  const numYTicks = 5;
  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < numYTicks; i++) {
      ticks.push(minY + (i * (maxY - minY)) / (numYTicks - 1));
    }
    return ticks;
  }, [minY, maxY]);

  const numXTicks = 5;
  const xTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < numXTicks; i++) {
      ticks.push(minX + (i * (maxX - minX)) / (numXTicks - 1));
    }
    return ticks;
  }, [minX, maxX]);

  // Format x-axis tick labels as time (e.g. "12:13 PM")
  const formatTime = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // Last data point for drawing the red dot
  const lastPoint = sortedData[sortedData.length - 1];

  return (
    <div className={styles.graphContainer}>
      {/* Top header labels */}
      <div className={styles.headerRow}>
        <div className={styles.chanceInfo}>
          <span className={styles.chanceValue}>{currentChance}% chance</span>
          {delta < 0 ? (
            <span className={styles.deltaDown}>▼ {Math.abs(delta)}</span>
          ) : (
            <span className={styles.deltaUp}>▲ {Math.abs(delta)}</span>
          )}
        </div>
      </div>

      {/* Main SVG chart */}
      <svg
        className={styles.chart}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Horizontal grid lines with right-aligned y-axis percentage labels */}
        {yTicks.map((tickVal, i) => {
          const y = scaleY(tickVal);
          return (
            <g key={`y-grid-${i}`}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke="#eee"
              />
              <text
                x={width - 5}
                y={y - 2}
                textAnchor="end"
                fill="#999"
                fontSize="12"
              >
                {(tickVal * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
        {/* The red line */}
        <path d={linePath} fill="none" stroke="#db2c2c" strokeWidth="2" />
        {/* Red dot at the last data point */}
        {lastPoint && (
          <circle
            cx={scaleX(lastPoint.x)}
            cy={scaleY(lastPoint.y)}
            r="4"
            fill="#db2c2c"
          />
        )}
        {/* Bottom x-axis time labels */}
        {xTicks.map((tickVal, i) => {
          const x = scaleX(tickVal);
          return (
            <text
              key={`x-tick-${i}`}
              x={x}
              y={height - 5}
              textAnchor="middle"
              fill="#666"
              fontSize="12"
            >
              {formatTime(tickVal)}
            </text>
          );
        })}
      </svg>

      {/* Time range buttons */}
      <div className={styles.buttonRow}>
        {availableRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`${styles.rangeButton} ${
              selectedRange === range ? styles.active : ""
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
