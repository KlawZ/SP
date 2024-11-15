import React from "react";
import { Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import "./Sidebar.css";

function Sidebar() {
  const { username, userRole, setUserRole } = useStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole("");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Welcome {username}</h2>
      <ul>
        {userRole === "investor" && (
          <>
            <li>
              <NavLink to="/home" activeClassName="active-link">
                Home
              </NavLink>
            </li>
          </>
        )}
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
      <Button variant="danger" onClick={handleLogout} className="mt-3">
        Logout
      </Button>
    </div>
  );
}

export default Sidebar;
