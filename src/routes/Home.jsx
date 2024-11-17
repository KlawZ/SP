import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import PieChart from "../components/PieChart";
import { useStateContext } from "../context/StateContext";

const Home = () => {
  const { userID, balance } = useStateContext();
  const [stockValues, setStockValues] = useState([]);

  useEffect(() => {
    const fetchStockValues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/investor/stocks",
          {
            params: { userID },
          }
        );
        setStockValues(response.data.data);
      } catch (error) {
        console.error("Error fetching stock values:", error);
      }
    };

    if (userID) {
      fetchStockValues();
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flexGrow: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PieChart balance={balance} stockValues={stockValues} />
      </div>
    </div>
  );
};

export default Home;
