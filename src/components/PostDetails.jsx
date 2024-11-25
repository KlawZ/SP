import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const PostDetails = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);

  const handleVote = async (voteType) => {
    try {
      await axios.put("http://localhost:3000/api/v1/posts/vote", {
        post_id: post.post_id,
        voteType: voteType,
      });

      if (voteType === "upvote") {
        setUpvotes((prev) => prev + 1);
      } else if (voteType === "downvote") {
        setDownvotes((prev) => prev + 1);
      }
    } catch (error) {
      console.error(`Error ${voteType}ing the post:`, error);
    }
  };

  return (
    <Card
      style={{
        width: "80%",
        backgroundColor: "lightblue",
        marginTop: "5px",
        marginLeft: "2%",
      }}
    >
      <Card.Body>
        <Card.Title>Advisor: {post.advisor_id}</Card.Title>
        <Card.Text>{post.content}</Card.Text>

        <div>
          <Button
            variant="outline-primary"
            onClick={() => handleVote("upvote")}
          >
            Upvote ({upvotes})
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => handleVote("downvote")}
            style={{ marginLeft: "0.5rem" }}
          >
            Downvote ({downvotes})
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostDetails;
