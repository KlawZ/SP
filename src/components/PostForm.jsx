import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useStateContext } from "../context/StateContext";
import axios from "axios";

const PostForm = () => {
  const { userID } = useStateContext();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    content: "",
    advisorID: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/advisors/posts",
        {
          advisor_id: userID,
          content: formData.content,
        }
      );
      if (response.status === 201) {
        setMessage({ type: "success", text: "Post submitted successfully!" });
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Error submitting post. Please try again.",
      });
      console.error("Error submitting post:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create a post</h1>
      <Form.Group controlId="content">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Enter post content"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Post
      </Button>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}
    </Form>
  );
};

export default PostForm;
