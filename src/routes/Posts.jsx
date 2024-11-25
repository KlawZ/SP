import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import PostForm from "../components/PostForm";
import PostDetails from "../components/PostDetails";
import { useStateContext } from "../context/StateContext";
import Sidebar from "../components/Sidebar";

const Posts = () => {
  const { userRole } = useStateContext();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/investors/posts"
      );
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (userRole === "investor") {
      fetchPosts();
    }
  }, []);

  return (
    <div>
      <Sidebar />
      {userRole === "advisor" && (
        <div style={{ marginLeft: "250px", flexGrow: 1 }}>
          <PostForm />
        </div>
      )}
      {userRole === "investor" && (
        <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "250px" }}>
          {posts.length === 0 ? (
            <div
              style={{
                position: "relative",
                marginLeft: "450px",
                height: "100vh",
              }}
            >
              <Alert
                variant="warning"
                style={{
                  maxHeight: "100px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "300px",
                  textAlign: "center",
                }}
              >
                No posts available.
              </Alert>
            </div>
          ) : (
            posts.map((post) => <PostDetails key={post.post_id} post={post} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
