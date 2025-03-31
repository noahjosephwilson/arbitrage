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

// Register Chart.js components.
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

// Initial structured stock data.
const initialStockData = [
  { timestamp: '2025-03-30T10:00:00', price: 103 },
  { timestamp: '2025-03-30T10:05:00', price: 120 },
  { timestamp: '2025-03-30T10:10:00', price: 150 },
  { timestamp: '2025-03-30T10:15:00', price: 130 },
  { timestamp: '2025-03-30T10:20:00', price: 178 },
  { timestamp: '2025-03-30T10:55:00', price: 160 }
];

export default function Graph() {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const vLineRef = useRef(null);
  const labelRef = useRef(null);

  // State for the stock data.
  const [stockData, setStockData] = useState(initialStockData);
  // Store hover index for crosshair info.
  const [hoverIndex, setHoverIndex] = useState(null);

  // Convert structured data into arrays needed by the chart.
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

  // Prepare chart data.
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        data: dataArray,
        fill: false,
        backgroundColor: '#00c28e',
        borderColor: '#00c28e',
        stepped: true,
        tension: 0,
        // Only show a circle on the final datapoint.
        pointRadius: dataArray.map((_, idx) => (idx === dataArray.length - 1 ? 5 : 0)),
        pointHoverRadius: dataArray.map((_, idx) => (idx === dataArray.length - 1 ? 5 : 0)),
      },
    ],
  };

  // Chart configuration options.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#fff',
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'HH:mm',
          displayFormats: { minute: 'HH:mm' },
        },
        min: new Date(xMin),
        max: new Date(extendedXMax),
        title: { display: false },
        grid: { display: false, drawBorder: false },
        ticks: { autoSkip: true, maxTicksLimit: 4, font: { size: 18 } },
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

  // Function to fetch live data from your AWS endpoint.
  // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint.
  async function fetchLiveStockData() {
    try {
      const response = await fetch('YOUR_API_ENDPOINT');
      const newData = await response.json();
      // Expect newData to be an array of objects: { timestamp: string, price: number }
      setStockData(newData);
    } catch (error) {
      console.error('Error fetching live stock data:', error);
    }
  }

  // Poll for new data every 5 seconds.
  useEffect(() => {
    const interval = setInterval(fetchLiveStockData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Determine current index (defaulting to the last datapoint).
  const currentIndex = hoverIndex === null ? dataArray.length - 1 : hoverIndex;
  const displayedValue = dataArray[currentIndex];
  const baseline = dataArray[0];
  const difference = displayedValue - baseline;
  const arrowSymbol = difference >= 0 ? '▲' : '▼';
  const absDiff = Math.abs(difference).toFixed(1);

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
      const eventY = event.clientY - canvasRect.top;

      // Hide crosshair if mouse is outside chart area.
      if (
        eventX < chartArea.left ||
        eventX > chartArea.right ||
        eventY < chartArea.top ||
        eventY > chartArea.bottom
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

      // Update the hover label with the formatted time.
      const xScale = scales.x;
      const continuousTimeValue = xScale.getValueForPixel(eventX);
      const formattedTime = new Date(continuousTimeValue).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (labelRef.current) {
        labelRef.current.textContent = formattedTime;
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
  }, [chartData]);

  return (
    <div className={styles.outerContainer}>
      {/* Info section displaying the current stock value */}
      <div className={styles.infoContainer}>
        <span className={styles.bigNumber}>{displayedValue}</span>
        <span className={styles.forecastText}>forecast</span>
        <span className={difference >= 0 ? styles.deltaPositive : styles.deltaNegative}>
          {arrowSymbol}{absDiff}
        </span>
      </div>
      {/* Chart container */}
      <div ref={containerRef} className={styles.chartContainer}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
        <div ref={vLineRef} className={styles.hoverLine} />
        <div ref={labelRef} className={styles.hoverLabel} />
      </div>
    </div>
  );
}
