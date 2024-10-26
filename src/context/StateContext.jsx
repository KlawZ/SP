import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const useStateContext = () => {
  return useContext(StateContext);
};

export const StateProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState("");

  const setUserData = (userID, username) => {
    setUserID(userID);
    setUsername(username);
  };

  return (
    <StateContext.Provider value={{ userID, username, setUserData }}>
      {children}
    </StateContext.Provider>
  );
};
