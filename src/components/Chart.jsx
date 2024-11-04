import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useStateContext } from "../context/StateContext";
import axios from "axios";
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

/*let day = 4;

const getCurrentDate = () => {
  day++;
  return `2024-11-0${day}`;
};*/

const TimeSeriesChart = () => {
  const { stocks, setStockData } = useStateContext();
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: "Stock Data",
        data: [], // Initially empty; will be populated with stock data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  });

  // Function to fetch stock data from the API
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/stocks");
      if (response.status === 201) {
        setStockData(response.data.data); // Update stocks in context
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  // Fetch data every 30 seconds
  useEffect(() => {
    fetchStocks(); // Initial fetch
    const interval = setInterval(fetchStocks, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [setStockData]);

  // Update chart data based on changes in stocks
  useEffect(() => {
    // Extract only data points for the specified stock symbol, e.g., "GOOGL"
    const stockSymbol = "GOOGL";
    const filteredStocks = stocks.filter(
      (stock) => stock.symbol === stockSymbol
    );

    // Update chart data with the new points from filteredStocks
    setChartData((prevChartData) => ({
      ...prevChartData,
      datasets: prevChartData.datasets.map((dataset) => ({
        ...dataset,
        data: filteredStocks.map((stock) => ({
          x: stock.time,
          y: stock.current_price,
        })),
      })),
    }));
  }, [stocks]); // Only run this when `stocks` updates

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Time Series Chart Example" },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "second" },
        title: { display: true, text: "Date" },
      },
      y: { title: { display: true, text: "Value" } },
    },
  };

  return (
    <div style={{ width: "500px", height: "200px", position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TimeSeriesChart;
