import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./routes/Home";
import Posts from "./routes/Posts";
import Proposals from "./routes/Proposals";
import Reviews from "./routes/Reviews";
import Stocks from "./routes/Stocks";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
