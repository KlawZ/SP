import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useStateContext } from "../context/StateContext";
import axios from "axios";

const ReviewForm = () => {
  const { userID } = useStateContext();
  const [formData, setFormData] = useState({
    advisor: "",
    rating: "",
    feedback: "",
  });
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/advisors"
        );
        setAdvisors(response.data.data); // Assuming data structure matches
      } catch (error) {
        console.error("Error fetching advisors:", error);
      }
    };
    fetchAdvisors();
  }, []);

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
        "http://localhost:3000/api/v1/investors/reviews",
        {
          investor_id: userID, // replace with actual investor ID if available
          advisor_id: formData.advisor,
          rating: formData.rating,
          feedback: formData.feedback,
        }
      );
      console.log(response.data); // Handle response data as needed
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Submit an advisor review</h1>
      <Form.Group controlId="advisor">
        <Form.Label>Advisor</Form.Label>
        <Form.Control
          as="select"
          name="advisor"
          value={formData.advisor}
          onChange={handleChange}
          required
        >
          <option value="">Choose an advisor...</option>
          {advisors.map((advisor) => (
            <option key={advisor.users_id} value={advisor.users_id}>
              {advisor.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="rating">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          as="select"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="">Choose...</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="feedback">
        <Form.Label>Feedback</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your feedback here"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Review
      </Button>
    </Form>
  );
};

export default ReviewForm;
