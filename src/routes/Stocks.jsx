import React, { useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TimeSeriesChart from "../components/Chart";
import { useStateContext } from "../context/StateContext";

const Stocks = () => {
  const { stocks, setStockData } = useStateContext();

  // Function to fetch stock data from the API
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/stocks");
      if (response.status === 200) {
        setStockData(response.data.data); // Updates the stocks in context
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks(); // Initial fetch

    const interval = setInterval(fetchStocks, 30000); // Fetch every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // No dependencies so it only runs once on mount
  return (
    <div>
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px", // Adjust to add space above the first chart
          paddingBottom: "20px", // Adds space below the last chart
          gap: "20px", // Adds space between each chart
        }}
      >
        {stocks.map((stock) => (
          <TimeSeriesChart key={stock.symbol} stockData={stock} />
        ))}
      </div>
    </div>
  );
};

export default Stocks;
