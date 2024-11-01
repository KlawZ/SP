import React from "react";
import Sidebar from "../components/Sidebar";
import TimeSeriesChart from "../components/Chart";

const Home = () => {
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
        <TimeSeriesChart />
      </div>
    </div>
  );
};

export default Home;
