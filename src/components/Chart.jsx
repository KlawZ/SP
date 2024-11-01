import React from "react";
import { realTimeData } from "./ChartData";
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

const TimeSeriesChart = () => {
  // Mock data for the time series chart
  const data = realTimeData;

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Time Series Chart Example",
      },
    },
    scales: {
      x: {
        type: "time", // Specify time scale
        time: {
          unit: "day", // Set time unit to day
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };
  return (
    <div style={{ width: "500px", height: "200px", position: "relative" }}>
      <Line data={data} options={options} />
    </div>
  );
};
export default TimeSeriesChart;
