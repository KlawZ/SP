import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [market, setMarket] = useState(
    localStorage.getItem("marketState") === "true"
  );

  useEffect(() => {
    // Fetch all users and posts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/users"
        ); // Adjust route as needed
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/posts"
        ); // Adjust route as needed
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete("http://localhost:3000/api/v1/admin/users", {
        params: { userId },
      });
      setUsers(users.filter((user) => user.users_id !== userId)); // Remove user from state
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete("http://localhost:3000/api/v1/admin/posts", {
        params: { postId },
      });
      setPosts(posts.filter((post) => post.post_id !== postId)); // Remove post from state
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleMarketToggle = () => {
    newMarketState = setMarket(!market);
    localStorage.setItem("marketState", newMarketState.toString());
  };

  return (
    <Container
      style={{ display: "grid", maxWidth: "800px", marginTop: "20px" }}
    >
      <h1 className="text-center">Admin Dashboard</h1>

      <section style={{ marginTop: "40px" }}>
        <h2>All Users</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.users_id}>
                <td>{user.users_id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.balance === null ? "null" : user.balance}</td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(user.users_id)}
                >
                  Delete
                </Button>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>All Posts</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Content</th>
              <th>Upvotes</th>
              <th>Downvotes</th>
              <th>Advisor ID</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.post_id}>
                <td>{post.post_id}</td>
                <td>{post.content}</td>
                <td>{post.upvotes}</td>
                <td>{post.downvotes}</td>
                <td>{post.advisor_id}</td>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePost(post.post_id)}
                >
                  Delete
                </Button>
              </tr>
            ))}
          </tbody>
        </Table>
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
    </Container>
  );
};

export default AdminDashboard;
