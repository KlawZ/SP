import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "../components/PostForm";
import PostDetails from "../components/PostDetails";
import { useStateContext } from "../context/StateContext";
import Sidebar from "../components/Sidebar";

const Posts = () => {
  const { userRole } = useStateContext();
  const [posts, setPosts] = useState([]);

  // Function to fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/investors/posts"
      );
      setPosts(response.data.data); // Assuming response contains 'data' with an array of posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts on component mount if userRole is investor
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
        <div style={{ marginLeft: "250px", flexGrow: 1 }}>
          {posts.map((post) => (
            <PostDetails key={post.post_id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
