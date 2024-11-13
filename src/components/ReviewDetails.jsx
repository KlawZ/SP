import React from "react";
import { Card } from "react-bootstrap";

const ReviewDetails = ({ review }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Investor: {review.investor}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Rating: {review.rating}
        </Card.Subtitle>
        <Card.Text>Feedback: {review.feedback}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewDetails;
