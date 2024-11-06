import React from "react";
import Sidebar from "../components/Sidebar";
import PieChart from "../components/PieChart";
import { useStateContext } from "../context/StateContext";

const Home = () => {
  const { balance } = useStateContext();

  return (
    <div>
      <Sidebar />
      <div style={{ width: "600px", margin: "auto" }}>
        <h2>User Balance</h2>
        <PieChart balance={balance} />
      </div>
    </div>
  );
};

export default Home;
