import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

const TimeSeriesChart = ({ stockData }) => {
  const { symbol, current_price, time } = stockData;

  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    setDataPoints((prevDataPoints) => [
      ...prevDataPoints,
      { x: time, y: current_price },
    ]);
  }, [time, current_price]);

  const chartData = {
    datasets: [
      {
        label: `Stock Data for ${symbol}`,
        data: dataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Time Series for ${symbol}` },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "minute" },
        title: { display: true, text: "Time" },
      },
      y: { title: { display: true, text: "Value" } },
    },
  };

  return (
    <div style={{ width: "800px", height: "300px", position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TimeSeriesChart;
