import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [market, setMarket] = useState(localStorage.getItem("marketState"));
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/users"
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete("http://localhost:3000/api/v1/admin/users", {
        params: { users_id: userId },
      });
      setUsers(users.filter((user) => user.users_id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleMarketToggle = () => {
    console.log(localStorage.getItem("marketState"));
    setMarket(!market);
    localStorage.setItem("marketState", market.toString());
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <Container
      style={{
        display: "grid",
        maxWidth: "800px",
        rowGap: "30px",
      }}
    >
      <h1 className="text-center">Admin Dashboard</h1>

      <section style={{ marginTop: "40px" }}>
        <h2>All Users</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.users_id}>
                <td>
                  <input
                    type="radio"
                    name="selectUser"
                    onChange={() => handleSelectUser(user.users_id)}
                  />
                </td>
                <td>{user.users_id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.balance === null ? "null" : user.balance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          variant="danger"
          onClick={() => handleDeleteUser(selectedUserId)}
          disabled={!selectedUserId}
        >
          Delete User
        </Button>
      </section>

      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "40px" }}
      >
        <Button
          variant={market ? "success" : "danger"}
          onClick={handleMarketToggle}
          style={{ width: "150px" }}
        >
          {market ? "Open Market" : "Close Market"}
        </Button>
      </div>
      <LogoutButton />
    </Container>
  );
};

export default AdminDashboard;
