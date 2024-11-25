import React, { useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TimeSeriesChart from "../components/Chart";
import { useStateContext } from "../context/StateContext";

const Stocks = () => {
  const { stocks, setStockData } = useStateContext();

  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/stocks");
      if (response.status === 200) {
        setStockData(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks();

    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
          gap: "20px",
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
