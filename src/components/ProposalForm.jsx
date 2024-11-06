import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useStateContext } from "../context/StateContext";
import "./ProposalForm.css";

const ProposalForm = () => {
  const { userID } = useStateContext();

  const [formData, setFormData] = useState({
    content: "",
    quantity: 0,
    stock: "",
    advisor: 0,
    type: "",
  });

  const [advisors, setAdvisors] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Fetch advisors using axios
    axios
      .get("http://localhost:3000/api/v1/advisors")
      .then((response) => setAdvisors(response.data.data))
      .catch((error) => console.error("Error fetching advisors:", error));

    // Fetch stocks using axios
    axios
      .get("http://localhost:3000/api/v1/stocks")
      .then((response) => setStocks(response.data.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      // Send formData to the backend
      const response = await axios.post(
        "http://localhost:3000/api/v1/proposal",
        {
          content: formData.content,
          quantity: formData.quantity,
          stock_id: formData.stock,
          advisor_id: formData.advisor,
          investor_id: userID,
          type: formData.type,
        }
      );
      if (response.status === 201) {
        setMessage("Proposal Submitted");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <h1>Buy or Sell Stocks</h1>

        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select an action</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="stock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            as="select"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          >
            <option value="">Select a stock</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.symbol}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="advisor">
          <Form.Label>Advisor</Form.Label>
          <Form.Control
            as="select"
            name="advisor"
            value={formData.advisor}
            onChange={handleChange}
            required
          >
            <option value="">Select an advisor</option>
            {advisors.map((advisor) => (
              <option key={advisor.users_id} value={advisor.users_id}>
                {advisor.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          Send
        </Button>
        {message}
      </Form>
    </div>
  );
};

export default ProposalForm;
