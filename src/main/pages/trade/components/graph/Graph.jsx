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
  { timestamp: '2025-03-01T10:00:00', price: 100 },
  { timestamp: '2025-03-02T10:00:00', price: 102.5 },
  { timestamp: '2025-03-03T10:00:00', price: 101.2 },
  { timestamp: '2025-03-04T10:00:00', price: 104.0 },
  { timestamp: '2025-03-05T10:00:00', price: 103.5 },
  { timestamp: '2025-03-06T10:00:00', price: 105.1 },
  { timestamp: '2025-03-07T10:00:00', price: 104.0 },
  { timestamp: '2025-03-08T10:00:00', price: 106.7 },
  { timestamp: '2025-03-09T10:00:00', price: 107.0 },
  { timestamp: '2025-03-10T10:00:00', price: 105.8 },
  { timestamp: '2025-03-11T10:00:00', price: 106.5 },
  { timestamp: '2025-03-12T10:00:00', price: 108.0 },
  { timestamp: '2025-03-13T10:00:00', price: 107.2 },
  { timestamp: '2025-03-14T10:00:00', price: 108.5 },
  { timestamp: '2025-03-15T10:00:00', price: 110.0 },
  { timestamp: '2025-03-16T10:00:00', price: 109.2 },
  { timestamp: '2025-03-17T10:00:00', price: 111.3 },
  { timestamp: '2025-03-18T10:00:00', price: 110.7 },
  { timestamp: '2025-03-19T10:00:00', price: 112.5 },
  { timestamp: '2025-03-20T10:00:00', price: 113.0 },
  { timestamp: '2025-03-21T10:00:00', price: 112.0 },
  { timestamp: '2025-03-22T10:00:00', price: 113.7 },
  { timestamp: '2025-03-23T10:00:00', price: 114.5 },
  { timestamp: '2025-03-24T10:00:00', price: 113.2 },
  { timestamp: '2025-03-25T10:00:00', price: 112.8 },
  { timestamp: '2025-03-26T10:00:00', price: 114.0 },
  { timestamp: '2025-03-27T10:00:00', price: 115.5 },
  { timestamp: '2025-03-28T10:00:00', price: 114.8 },
  { timestamp: '2025-03-29T10:00:00', price: 116.2 },
  { timestamp: '2025-03-30T10:00:00', price: 117.0 },
  { timestamp: '2025-03-31T10:00:00', price: 116.0 },
  { timestamp: '2025-04-01T10:00:00', price: 117.5 },
  { timestamp: '2025-04-02T10:00:00', price: 118.3 },
  { timestamp: '2025-04-03T10:00:00', price: 117.7 },
  { timestamp: '2025-04-04T10:00:00', price: 119.0 },
  { timestamp: '2025-04-05T10:00:00', price: 118.5 },
  { timestamp: '2025-04-06T10:00:00', price: 120.0 },
  { timestamp: '2025-04-07T10:00:00', price: 121.2 },
  { timestamp: '2025-04-08T10:00:00', price: 120.5 },
  { timestamp: '2025-04-09T10:00:00', price: 122.0 },
  { timestamp: '2025-04-10T10:00:00', price: 121.0 },
  { timestamp: '2025-04-11T10:00:00', price: 122.5 },
  { timestamp: '2025-04-12T10:00:00', price: 123.5 },
  { timestamp: '2025-04-13T10:00:00', price: 122.8 },
  { timestamp: '2025-04-14T10:00:00', price: 124.0 },
  { timestamp: '2025-04-15T10:00:00', price: 125.5 },
  { timestamp: '2025-04-16T10:00:00', price: 124.7 },
  { timestamp: '2025-04-17T10:00:00', price: 126.0 },
  { timestamp: '2025-04-18T10:00:00', price: 127.0 },
  { timestamp: '2025-04-19T10:00:00', price: 126.5 },
  { timestamp: '2025-04-20T10:00:00', price: 127.8 },
  { timestamp: '2025-04-21T10:00:00', price: 128.5 },
  { timestamp: '2025-04-22T10:00:00', price: 127.2 },
  { timestamp: '2025-04-23T10:00:00', price: 128.0 },
  { timestamp: '2025-04-24T10:00:00', price: 129.5 },
  { timestamp: '2025-04-25T10:00:00', price: 130.0 },
  { timestamp: '2025-04-26T10:00:00', price: 129.0 },
  { timestamp: '2025-04-27T10:00:00', price: 130.5 },
  { timestamp: '2025-04-28T10:00:00', price: 131.0 },
  { timestamp: '2025-04-29T10:00:00', price: 130.2 },
  { timestamp: '2025-04-30T10:00:00', price: 131.5 },
  { timestamp: '2025-05-01T10:00:00', price: 132.2 },
  { timestamp: '2025-05-02T10:00:00', price: 131.0 },
  { timestamp: '2025-05-03T10:00:00', price: 133.0 },
  { timestamp: '2025-05-04T10:00:00', price: 132.0 },
  { timestamp: '2025-05-05T10:00:00', price: 134.5 },
  { timestamp: '2025-05-06T10:00:00', price: 133.8 },
  { timestamp: '2025-05-07T10:00:00', price: 135.0 },
  { timestamp: '2025-05-08T10:00:00', price: 134.2 },
  { timestamp: '2025-05-09T10:00:00', price: 136.0 },
  { timestamp: '2025-05-10T10:00:00', price: 135.0 },
  { timestamp: '2025-05-11T10:00:00', price: 136.5 },
  { timestamp: '2025-05-12T10:00:00', price: 137.0 },
  { timestamp: '2025-05-13T10:00:00', price: 136.2 },
  { timestamp: '2025-05-14T10:00:00', price: 137.5 },
  { timestamp: '2025-05-15T10:00:00', price: 138.0 },
  { timestamp: '2025-05-16T10:00:00', price: 137.0 },
  { timestamp: '2025-05-17T10:00:00', price: 138.5 },
  { timestamp: '2025-05-18T10:00:00', price: 139.2 },
  { timestamp: '2025-05-19T10:00:00', price: 138.0 },
  { timestamp: '2025-05-20T10:00:00', price: 139.0 },
  { timestamp: '2025-05-21T10:00:00', price: 140.0 },
  { timestamp: '2025-05-22T10:00:00', price: 139.5 },
  { timestamp: '2025-05-23T10:00:00', price: 141.0 },
  { timestamp: '2025-05-24T10:00:00', price: 140.2 },
  { timestamp: '2025-05-25T10:00:00', price: 142.0 },
  { timestamp: '2025-05-26T10:00:00', price: 141.0 },
  { timestamp: '2025-05-27T10:00:00', price: 142.5 },
  { timestamp: '2025-05-28T10:00:00', price: 143.0 },
  { timestamp: '2025-05-29T10:00:00', price: 142.0 },
  { timestamp: '2025-05-30T10:00:00', price: 143.5 },
  { timestamp: '2025-05-31T10:00:00', price: 144.0 },
  { timestamp: '2025-06-01T10:00:00', price: 143.0 },
  { timestamp: '2025-06-02T10:00:00', price: 144.5 },
  { timestamp: '2025-06-03T10:00:00', price: 145.0 },
  { timestamp: '2025-06-04T10:00:00', price: 144.2 },
  { timestamp: '2025-06-05T10:00:00', price: 145.5 },
  { timestamp: '2025-06-06T10:00:00', price: 146.0 },
  { timestamp: '2025-06-07T10:00:00', price: 145.0 },
  { timestamp: '2025-06-08T10:00:00', price: 146.5 }
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
  const [startIndex, setStartIndex] = useState(null);
  const [endIndex, setEndIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getChartArrays = useCallback(() => {
    if (!stockData || !Array.isArray(stockData)) {
      return { dataArray: [], timeLabels: [] };
    }
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

  // Helper to calculate a "nice" tick step.
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

  // Compute x‑axis boundaries based on current dataset.
  const xValues = timeLabels.map(label => new Date(label).getTime());
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const xRange = xMax - xMin;
  // Extend the right boundary by 3% of the x‑range.
  const extendedXMax = xMax + xRange * 0.03;

  // Always use the first and last datapoints for overall color.
  const baseline = dataArray[0];
  const lastValue = dataArray[dataArray.length - 1];
  const overallDelta = lastValue - baseline;
  const overallColor = overallDelta >= 0 ? '#00c28e' : '#dc3545';

  // For the info section, use the hovered datapoint if available.
  const currentIndex = dataArray.length > 0 ? (hoverIndex === null ? dataArray.length - 1 : hoverIndex) : 0;
  const displayedValue = dataArray.length > 0 ? dataArray[currentIndex] : 0;

  // Calculate the percent change for the full dataset when no selection is made
  useEffect(() => {
    if (dataArray.length > 0 && startIndex === null && endIndex === null) {
      // Default to the entire range - first and last points
      setStartIndex(0);
      setEndIndex(dataArray.length - 1);
    }
  }, [dataArray, startIndex, endIndex]);

  // Update chart data when a different interval is selected.
  const handleIntervalChange = (label) => {
    setSelectedInterval(label);
    setStockData(dataSets[label]);
    // Reset the selection but it will be set to default range by the useEffect
    setStartIndex(null);
    setEndIndex(null);
    setIsDragging(false);
  };

  let percentChangeText = '';
  if (startIndex !== null && endIndex !== null) {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const startPrice = dataArray[start];
    const endPrice = dataArray[end];
    const percentChange = ((endPrice - startPrice) / startPrice) * 100;
    const symbol = percentChange >= 0 ? '▲' : '▼';
    const formatted = Math.abs(percentChange).toFixed(2);
    percentChangeText = `${symbol}${formatted}% from index ${start} to ${end}`;
  }
  
  const formatDateRange = (startDate, endDate, interval) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (interval === '6H' || interval === '1D') {
      return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (interval === '1W') {
      return `${start.toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    } else {
      return `${start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  // Calculate the hoveredDelta based on selection or full range
  let hoveredDelta = 0;
  let symbol = '▲';

  if (startIndex !== null && endIndex !== null) {
    let fromIdx = startIndex;
    let toIdx = endIndex;

    if (startIndex > endIndex) {
      fromIdx = endIndex;
      toIdx = startIndex;
    }

    const startPrice = dataArray[fromIdx];
    const endPrice = dataArray[toIdx];

    const delta = ((endPrice - startPrice) / startPrice) * 100;
    hoveredDelta = delta;
    symbol = delta >= 0 ? '▲' : '▼';
  } else if (dataArray.length > 0) {
    // Fallback if startIndex and endIndex are somehow null
    const startPrice = dataArray[0];
    const endPrice = dataArray[dataArray.length - 1];
    const delta = ((endPrice - startPrice) / startPrice) * 100;
    hoveredDelta = delta;
    symbol = delta >= 0 ? '▲' : '▼';
  }

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
        backgroundColor: overallColor,
        borderColor: overallColor,
        stepped: true, // Changing this to false to fix shading under graphs
        tension: 0,
        // Only show a circle on the final datapoint.
        pointRadius: dataArray.map((_, idx) => {
          if (startIndex !== null && endIndex !== null) {
            return idx === endIndex ? 5 : 0;
          }
          return idx === dataArray.length - 1 ? 5 : 0;
        }),        
        pointHoverRadius: dataArray.map((_, idx) => (idx === dataArray.length - 1 ? 5 : 0)),
      },
    ],
  };

  // Configure the x‑axis to start at the first datapoint and extend slightly past the last.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#fff',
    animation: false,
    layout: {
      padding: {
        left: 20,
        right: 20,
      },
    },
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
        offset: false,
        title: { display: false },
        grid: { display: false, drawBorder: false },
        ticks: { 
          autoSkip: true, 
          maxTicksLimit: isTimeScale ? 4 : 7, 
          font: { size: 18 },
          padding: 10,
          align: 'start'
        },
        border: { 
          display: false,
        },
      },
      y: {
        title: { display: false },
        suggestedMin: adjustedMin,
        suggestedMax: adjustedMax,
        ticks: { stepSize: tickStep, font: { size: 18 }, color: '#000',},
        position: 'right',
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.3)', // lighter lines
        },
        border: { 
          display: false, // Remove y-axis
          dash: [2, 4],
        },
      },
    },
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      regionShading: {
        startIndex,
        endIndex
      }
    },
    hover: { mode: 'nearest', intersect: false },
  };

  ChartJS.register({
    id: 'regionShading',
    beforeDraw: (chart) => {
      const {ctx, chartArea} = chart;
      const pluginOptions = chart.options.plugins.regionShading;
      const meta = chart.getDatasetMeta(0);
  
      if (
        pluginOptions.startIndex !== null &&
        pluginOptions.endIndex !== null &&
        meta.data.length > 0
      ) {
        const start = Math.min(pluginOptions.startIndex, pluginOptions.endIndex);
        const end = Math.max(pluginOptions.startIndex, pluginOptions.endIndex);
        const startPrice = chart.data.datasets[0].data[start];
        const endPrice = chart.data.datasets[0].data[end];
        const isUp = endPrice > startPrice;
        ctx.save();
        ctx.fillStyle = isUp ? 'rgba(0, 194, 142, 0.2)' : 'rgba(220, 53, 69, 0.2)';
  
        const path = new Path2D();
        const firstPoint = meta.data[start];
        path.moveTo(firstPoint.x, chartArea.bottom);
  
        // Draw stepped path
        let currentX = firstPoint.x;
        path.lineTo(currentX, meta.data[start].y);

        for (let i = start; i < end; i++) {
          const currentPoint = meta.data[i];
          const nextPoint = meta.data[i + 1];
          
          // Draw horizontal line to the next x position
          path.lineTo(nextPoint.x, currentPoint.y);
          // Draw vertical line to the next y position
          path.lineTo(nextPoint.x, nextPoint.y);
        }
  
        const lastPoint = meta.data[end];
        path.lineTo(lastPoint.x, lastPoint.y);
        path.lineTo(lastPoint.x, chartArea.bottom);
        path.closePath();
  
        ctx.fill(path);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        // Left dashed line
        ctx.beginPath();
        ctx.moveTo(firstPoint.x, chartArea.top);
        ctx.lineTo(firstPoint.x, chartArea.bottom);
        ctx.stroke();

        // Right dashed line
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, chartArea.top);
        ctx.lineTo(lastPoint.x, chartArea.bottom);
        ctx.stroke();

        ctx.setLineDash([]); // reset dash
        ctx.restore();
      }
    }
  });  
  

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
      if (eventX < chartArea.left || eventX > chartArea.right) {
        if (vLineRef.current) vLineRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
        if (!isDragging) setHoverIndex(null);
        return;
      }

      const meta = chart.getDatasetMeta(0);
      if (!meta.data || meta.data.length === 0) return;

      // Hide if mouse is to the right of the last datapoint.
      const lastDataPointX = meta.data[meta.data.length - 1].x;
      if (eventX >= lastDataPointX) {
        if (vLineRef.current) vLineRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
        if (!isDragging) setHoverIndex(null);
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

      if (isDragging) {
        setEndIndex(snappedIndex);
      } else {
        setHoverIndex(snappedIndex);
      }

      // Format the hover label based on the selected interval.
      const timeValue = new Date(scales.x.getValueForPixel(eventX));
      let formattedLabel;
      if (selectedInterval === '6H' || selectedInterval === '1D') {
        formattedLabel = timeValue.toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      } else {
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

    const handleMouseDown = (event) => {
      const chartInstance = chartRef.current;
      if (!chartInstance) return;
    
      const points = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);
      if (points.length === 0) return;
    
      const clickedIndex = points[0].index;
      setStartIndex(clickedIndex);
      setEndIndex(clickedIndex);
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        if (vLineRef.current) vLineRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
        setHoverIndex(null);
      }
    };

    canvas.addEventListener('mousemove', updateCrosshair);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', updateCrosshair);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [chartData, selectedInterval, isDragging]);

  return (
    <div className={styles.outerContainer}>
      {/* Info section displaying the current stock value and delta */}
      <div className={styles.infoContainer}>
        <span className={styles.bigNumber}>{displayedValue}</span>
        <span className={styles.forecastText}>forecast</span>
        <span className={hoveredDelta >= 0 ? styles.deltaPositive : styles.deltaNegative}>
          {symbol}{Math.abs(hoveredDelta).toFixed(1)}%
        </span>
        {startIndex !== null && endIndex !== null && timeLabels.length > 0 && (
          <span className={styles.dateRange}>
            {formatDateRange(timeLabels[Math.min(startIndex, endIndex)], timeLabels[Math.max(startIndex, endIndex)], selectedInterval)}
          </span>
        )}
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
                ? { backgroundColor: overallColor, color: 'black', borderColor: overallColor }
                : { color: overallColor }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
