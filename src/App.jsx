import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Home from "./routes/Home";
import Posts from "./routes/Posts";
import Proposals from "./routes/Proposals";
import Reviews from "./routes/Reviews";
import Stocks from "./routes/Stocks";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {" "}
        {/* Flex container for sidebar and main content */}
        {isLoggedIn && <Sidebar />} {/* Render sidebar only if logged in */}
        <div style={{ marginLeft: isLoggedIn ? "250px" : "0", width: "100%" }}>
          {" "}
          {/* Adjust margin for main content */}
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
            {/* Protected Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="*" element={<Navigate to="/" />} />{" "}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
