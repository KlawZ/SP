import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ balance, stockValues }) => {
  const data = {
    labels: ["Balance", ...stockValues.map((stock) => stock.symbol)],
    datasets: [
      {
        data: [balance, ...stockValues.map((stock) => stock.value)],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Your Portfolio Distribution",
        font: {
          size: 18,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
