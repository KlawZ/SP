import React from "react";
import { NavLink } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import "./Sidebar.css";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  const { username, userRole } = useStateContext();

  return (
    <div className="sidebar">
      <h2>Welcome {username}</h2>
      <ul>
        {userRole === "investor" && (
          <>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/stocks">Stocks</NavLink>
        </li>
        <li>
          <NavLink to="/proposals">Proposals</NavLink>
        </li>
        <li>
          <NavLink to="/posts">Posts</NavLink>
        </li>
        <li>
          <NavLink to="/reviews">Reviews</NavLink>
        </li>
      </ul>
      <LogoutButton className="logout-button" />
    </div>
  );
}

export default Sidebar;
