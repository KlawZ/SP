import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const useStateContext = () => {
  return useContext(StateContext);
};

export const StateProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState("");
  const [stocks, setStocks] = useState([]);

  const setUserData = (userID, username) => {
    setUserID(userID);
    setUsername(username);
  };

  const setStockData = (newData) => {
    if (!Array.isArray(newData)) {
      console.error("Expected newData to be an array");
      return;
    }
    setStocks((prevStocks) => [...prevStocks, ...newData]);
  };

  return (
    <StateContext.Provider
      value={{ userID, username, setUserData, stocks, setStockData }}
    >
      {children}
    </StateContext.Provider>
  );
};
