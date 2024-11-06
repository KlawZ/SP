import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const useStateContext = () => {
  return useContext(StateContext);
};

export const StateProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [balance, setBalance] = useState();
  const [stocks, setStocks] = useState([]);

  const setUserData = (userID, username, userRole, balance) => {
    setUserID(userID);
    setUsername(username);
    setUserRole(userRole);
    setBalance(balance);
  };

  const setStockData = (newData) => {
    if (!Array.isArray(newData)) {
      console.error("Expected newData to be an array");
      return;
    }
    setStocks(() => [...newData]);
  };

  return (
    <StateContext.Provider
      value={{
        userID,
        username,
        userRole,
        balance,
        setUserData,
        stocks,
        setStockData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
