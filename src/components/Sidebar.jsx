import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <NavLink to="/home" activeClassName="active-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" activeClassName="active-link">
            Posts
          </NavLink>
        </li>
        <li>
          <NavLink to="/proposals" activeClassName="active-link">
            Proposals
          </NavLink>
        </li>
        <li>
          <NavLink to="/reviews" activeClassName="active-link">
            Reviews
          </NavLink>
        </li>
        <li>
          <NavLink to="/stocks" activeClassName="active-link">
            Stocks
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
