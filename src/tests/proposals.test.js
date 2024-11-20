import request from "supertest";
import app from "../server/index.js";
import { query } from "../db/index.js"; // Import the mocked query function
jest.mock("../db/index.js", () => ({
  __esModule: true,
  query: jest.fn(), // Mock `query` as a Jest mock function
}));

describe("PUT /api/v1/proposals/update", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should accept a proposal and record a transaction for a buy type", async () => {
    // Mock database responses
    query
      .mockResolvedValueOnce({
        rows: [
          {
            proposal_id: 1,
            stock_id: "AAPL",
            quantity: 10,
            type: "buy",
            investor_id: 123,
          },
        ],
      }) // Update proposal
      .mockResolvedValueOnce({ rows: [{ current_price: 150 }] }) // Retrieve stock price
      .mockResolvedValueOnce({ rows: [] }) // Insert transaction
      .mockResolvedValueOnce({ rows: [] }) // Update stock_users
      .mockResolvedValueOnce({ rows: [] }); // Update user balance

    const payload = { proposal_id: 1, accepted: true };

    // Make the PUT request
    const response = await request(app)
      .put("/api/v1/proposals/update")
      .send(payload);

    // Ensure status is 200
    expect(response.status).toBe(200);

    // Ensure the response message is correct
    expect(response.body).toHaveProperty(
      "message",
      "Proposal accepted, transaction recorded, and portfolio updated."
    );

    // Ensure the queries were called correctly
    expect(query).toHaveBeenCalledWith(
      "UPDATE proposals SET accepted = $1 WHERE proposal_id = $2 RETURNING *",
      [true, 1]
    );
    expect(query).toHaveBeenCalledWith(
      "SELECT current_price FROM stocks WHERE symbol = $1",
      ["AAPL"]
    );
  });

  it("should decline a proposal", async () => {
    // Mock database response for proposal update
    query.mockResolvedValueOnce({
      rows: [{ proposal_id: 2 }],
    });

    const payload = { proposal_id: 2, accepted: false };

    // Make the PUT request
    const response = await request(app)
      .put("/api/v1/proposals/update")
      .send(payload);

    // Ensure status is 200
    expect(response.status).toBe(200);

    // Ensure the response message is correct
    expect(response.body).toHaveProperty("message", "Proposal declined.");

    // Ensure the queries were called correctly
    expect(query).toHaveBeenCalledWith(
      "UPDATE proposals SET accepted = $1 WHERE proposal_id = $2 RETURNING *",
      [false, 2]
    );
  });

  it("should return 500 if the database query fails", async () => {
    // Mock database query to throw an error
    query.mockRejectedValueOnce(new Error("Database error"));

    const payload = { proposal_id: 9999, accepted: true };

    // Make the PUT request
    const response = await request(app)
      .put("/api/v1/proposals/update")
      .send(payload);

    // Ensure status is 500
    expect(response.status).toBe(500);

    // Ensure the response contains an error message
    expect(response.body).toHaveProperty("error", "Internal server error");

    // Ensure the queries were called
    expect(query).toHaveBeenCalledWith(
      "UPDATE proposals SET accepted = $1 WHERE proposal_id = $2 RETURNING *",
      [true, 9999]
    );
  });
});
