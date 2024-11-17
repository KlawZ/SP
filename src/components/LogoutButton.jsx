import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";

function LogoutButton() {
  const { setUserRole } = useStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole(""); // Clear the user role
    localStorage.clear(); // Optional: Clear localStorage if needed
    navigate("/"); // Redirect to login or home page
  };

  return (
    <Button variant="danger" onClick={handleLogout} className="logout-button">
      Logout
    </Button>
  );
}

export default LogoutButton;
