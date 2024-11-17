import React, { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Alert } from "react-bootstrap";

function ProposalDetails({ proposal }) {
  const [message, setMessage] = useState(null);
  const updateProposalStatus = async (status) => {
    try {
      await axios.put("http://localhost:3000/api/v1/proposals/update", {
        accepted: status,
        proposal_id: proposal.proposal_id,
      });
      setMessage({
        type: "success",
        text: `Proposal successfully ${status ? "accepted" : "declined"}.`,
      });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update proposal status." });
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }}>
      <Card
        style={{
          padding: "20px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Card.Header as="h2" style={{ backgroundColor: "lightblue" }}>
          Proposal Details
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Content:</strong> {proposal.content}
          </Card.Text>
          <Card.Text>
            <strong>Quantity:</strong> {proposal.quantity}
          </Card.Text>
          <Card.Text>
            <strong>Stock:</strong> {proposal.stock_id}
          </Card.Text>
          <Card.Text>
            <strong>Investor:</strong> {proposal.investor_id}
          </Card.Text>
          <Card.Text>
            <strong>Type:</strong> {proposal.type}
          </Card.Text>

          {message && (
            <Alert variant={message.type === "success" ? "success" : "danger"}>
              {message.text}
            </Alert>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="success"
              className="me-2"
              onClick={() => updateProposalStatus(true)}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => updateProposalStatus(false)}
            >
              Decline
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProposalDetails;
