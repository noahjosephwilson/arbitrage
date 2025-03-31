"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './Graph.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Define four sets of example data.
const data6H = [
  { timestamp: '2025-03-30T10:00:00', price: 103 },
  { timestamp: '2025-03-30T10:05:00', price: 120 },
  { timestamp: '2025-03-30T10:10:00', price: 150 },
  { timestamp: '2025-03-30T10:15:00', price: 130 },
  { timestamp: '2025-03-30T10:20:00', price: 78 },
  { timestamp: '2025-03-30T10:55:00', price: 60 },
];

const data1D = [
  { timestamp: '2025-03-30T09:00:00', price: 100 },
  { timestamp: '2025-03-30T10:00:00', price: 105 },
  { timestamp: '2025-03-30T11:00:00', price: 110 },
  { timestamp: '2025-03-30T12:00:00', price: 120 },
  { timestamp: '2025-03-30T13:00:00', price: 115 },
  { timestamp: '2025-03-30T14:00:00', price: 130 },
  { timestamp: '2025-03-30T15:00:00', price: 125 },
  { timestamp: '2025-03-30T16:00:00', price: 135 },
];

const data1W = [
  { timestamp: '2025-03-24T10:00:00', price: 95 },
  { timestamp: '2025-03-25T10:00:00', price: 100 },
  { timestamp: '2025-03-26T10:00:00', price: 110 },
  { timestamp: '2025-03-27T10:00:00', price: 105 },
  { timestamp: '2025-03-28T10:00:00', price: 115 },
  { timestamp: '2025-03-29T10:00:00', price: 120 },
  { timestamp: '2025-03-30T10:00:00', price: 130 },
];

const dataAll = [
  { timestamp: '2025-03-01T10:00:00', price: 90 },
  { timestamp: '2025-03-05T10:00:00', price: 95 },
  { timestamp: '2025-03-10T10:00:00', price: 100 },
  { timestamp: '2025-03-15T10:00:00', price: 105 },
  { timestamp: '2025-03-20T10:00:00', price: 110 },
  { timestamp: '2025-03-25T10:00:00', price: 115 },
  { timestamp: '2025-03-30T10:00:00', price: 120 },
  { timestamp: '2025-04-04T10:00:00', price: 125 },
  { timestamp: '2025-04-09T10:00:00', price: 130 },
  { timestamp: '2025-04-14T10:00:00', price: 135 },
];

// Map intervals to datasets.
const dataSets = {
  "6H": data6H,
  "1D": data1D,
  "1W": data1W,
  "All": dataAll,
};

export default function Graph() {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const vLineRef = useRef(null);
  const labelRef = useRef(null);

  // Initialize with the "All" dataset.
  const [selectedInterval, setSelectedInterval] = useState('All');
  const [stockData, setStockData] = useState(dataSets['All']);
  const [hoverIndex, setHoverIndex] = useState(null);

  const getChartArrays = useCallback(() => {
    const dataArray = stockData.map(item => item.price);
    const timeLabels = stockData.map(item => item.timestamp);
    return { dataArray, timeLabels };
  }, [stockData]);

  const { dataArray, timeLabels } = getChartArrays();

  // Compute y‑axis boundaries.
  const minValue = Math.min(...dataArray);
  const maxValue = Math.max(...dataArray);
  const range = maxValue - minValue;
  const adjustedMin = minValue - range * 0.03;
  const adjustedMax = maxValue + range * 0.03;

  // Helper to calculate a “nice” tick step.
  const niceNum = (range, round) => {
    const exponent = Math.floor(Math.log10(range));
    const fraction = range / Math.pow(10, exponent);
    let niceFraction;
    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
  };
  const idealTicks = 6;
  const tickStep = niceNum((adjustedMax - adjustedMin) / (idealTicks - 1), true);

  // Compute x‑axis boundaries.
  const xValues = timeLabels.map(label => new Date(label).getTime());
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const xRange = xMax - xMin;
  const extendedXMax = xMax + xRange * 0.03;

  // Determine overall change from the start to the end of the data.
  const baseline = dataArray[0];
  const endValue = dataArray[dataArray.length - 1];
  const overallDiff = endValue - baseline;
  const chartColor = overallDiff >= 0 ? '#00c28e' : '#dc3545';

  // Button color will mirror the overall graph change.
  const buttonColor = chartColor;

  // Set displayedValue with fallback in case dataArray is empty.
  const currentIndex = dataArray.length > 0 ? (hoverIndex === null ? dataArray.length - 1 : hoverIndex) : 0;
  const displayedValue = dataArray.length > 0 ? dataArray[currentIndex] : 0;

  // Determine time scale options based on the selected interval.
  const isTimeScale = selectedInterval === "6H" || selectedInterval === "1D";
  const timeUnit = isTimeScale ? 'minute' : 'day';
  const tooltipFormat = isTimeScale ? 'hh:mm a' : 'MMM d';
  const displayFormats = isTimeScale
    ? { minute: 'hh:mm a', hour: 'hh:mm a' }
    : { day: 'MMM d' };

  // Prepare chart data.
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        data: dataArray,
        fill: false,
        backgroundColor: chartColor,
        borderColor: chartColor,
        stepped: true,
        tension: 0,
        // Only show a circle on the final datapoint.
        pointRadius: dataArray.map((_, idx) => (idx === dataArray.length - 1 ? 5 : 0)),
        pointHoverRadius: dataArray.map((_, idx) => (idx === dataArray.length - 1 ? 5 : 0)),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#fff',
    animation: false, // Disable animations
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeUnit,
          tooltipFormat: tooltipFormat,
          displayFormats: displayFormats,
        },
        min: new Date(xMin),
        max: new Date(extendedXMax),
        title: { display: false },
        grid: { display: false, drawBorder: false },
        ticks: { autoSkip: true, maxTicksLimit: isTimeScale ? 4 : 7, font: { size: 18 } },
      },
      y: {
        title: { display: false },
        suggestedMin: adjustedMin,
        suggestedMax: adjustedMax,
        ticks: { stepSize: tickStep, font: { size: 18 } },
        position: 'right',
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          drawBorder: false,
          borderColor: 'transparent',
          borderDash: [5, 5],
          borderDashOffset: 0,
          lineWidth: 1,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    hover: { mode: 'nearest', intersect: false },
  };

  // Chart crosshair functionality for interactivity.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.canvas;
    const updateCrosshair = (event) => {
      const { chartArea, scales } = chart;
      if (!chartArea) return;
      const canvasRect = canvas.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const eventX = event.clientX - canvasRect.left;

      // Hide crosshair if mouse is outside chart area.
      if (
        eventX < chartArea.left ||
        eventX > chartArea.right
      ) {
        if (vLineRef.current) vLineRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
        setHoverIndex(null);
        return;
      }

      const meta = chart.getDatasetMeta(0);
      if (!meta.data || meta.data.length === 0) return;

      // Hide if mouse is to the right of the last datapoint.
      const lastDataPointX = meta.data[meta.data.length - 1].x;
      if (eventX >= lastDataPointX) {
        if (vLineRef.current) vLineRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
        setHoverIndex(null);
        return;
      }

      // Position the vertical crosshair.
      const relativeX = canvasRect.left + eventX - containerRect.left;
      if (vLineRef.current) {
        vLineRef.current.style.left = `${relativeX}px`;
        vLineRef.current.style.top = `${canvasRect.top + chartArea.top - containerRect.top}px`;
        vLineRef.current.style.height = `${chartArea.bottom - chartArea.top}px`;
        vLineRef.current.style.display = 'block';
      }

      // Snap to the nearest datapoint.
      let snappedIndex = 0;
      for (let i = 0; i < meta.data.length; i++) {
        if (eventX >= meta.data[i].x) {
          snappedIndex = i;
        } else {
          break;
        }
      }
      setHoverIndex(snappedIndex);

      // Format the hover label based on the selected interval.
      const timeValue = new Date(scales.x.getValueForPixel(eventX));
      let formattedLabel;
      if (selectedInterval === '6H' || selectedInterval === '1D') {
        // For 6H and 1D, show full date and time with minutes, seconds, and AM/PM.
        formattedLabel = timeValue.toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      } else {
        // For 1W and All, show the date and the hour with AM/PM.
        const dateStr = timeValue.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const timeStr = timeValue.toLocaleTimeString([], { hour: 'numeric', hour12: true });
        formattedLabel = `${dateStr} at ${timeStr}`;
      }
      
      if (labelRef.current) {
        labelRef.current.textContent = formattedLabel;
        labelRef.current.style.left = `${relativeX}px`;
        labelRef.current.style.top = `${canvasRect.top + chartArea.top - containerRect.top - 30}px`;
        labelRef.current.style.display = 'block';
      }
    };

    const handleMouseLeave = () => {
      if (vLineRef.current) vLineRef.current.style.display = 'none';
      if (labelRef.current) labelRef.current.style.display = 'none';
      setHoverIndex(null);
    };

    canvas.addEventListener('mousemove', updateCrosshair);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', updateCrosshair);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [chartData, selectedInterval]);

  // Update chart data when a different interval is selected.
  const handleIntervalChange = (label) => {
    setSelectedInterval(label);
    setStockData(dataSets[label]);
  };

  return (
    <div className={styles.outerContainer}>
      {/* Info section displaying the current stock value */}
      <div className={styles.infoContainer}>
        <span className={styles.bigNumber}>{displayedValue}</span>
        <span className={styles.forecastText}>forecast</span>
        <span className={overallDiff >= 0 ? styles.deltaPositive : styles.deltaNegative}>
          {overallDiff >= 0 ? '▲' : '▼'}{Math.abs(overallDiff).toFixed(1)}
        </span>
      </div>
      {/* Chart container */}
      <div ref={containerRef} className={styles.chartContainer}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
        <div ref={vLineRef} className={styles.hoverLine} />
        <div ref={labelRef} className={styles.hoverLabel} />
      </div>
      {/* Interval options with dynamic colors */}
      <div className={styles.intervalOptions}>
        {["6H", "1D", "1W", "All"].map((label) => (
          <button 
            key={label}
            className={styles.intervalButton}
            onClick={() => handleIntervalChange(label)}
            style={
              selectedInterval === label
                ? { backgroundColor: buttonColor, color: 'black', borderColor: buttonColor }
                : { color: buttonColor }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
