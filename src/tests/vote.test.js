import request from "supertest";
import app from "../server/index.js"; // Adjust path based on your project structure

describe("PUT /api/v1/posts/vote", () => {
  it("should increment upvotes for a valid upvote request", async () => {
    const payload = { post_id: 14, voteType: "upvote" };

    // Make the PUT request
    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    // Ensure status is 200
    expect(response.status).toBe(200);

    // Ensure response body contains the expected structure
    expect(response.body).toHaveProperty("data");
    const updatedPost = response.body.data;
    expect(updatedPost).toHaveProperty("post_id", 14);
    expect(updatedPost).toHaveProperty("upvotes");
    expect(updatedPost.upvotes).toBeGreaterThan(0); // Adjust this based on your test DB
  });

  it("should increment downvotes for a valid downvote request", async () => {
    const payload = { post_id: 14, voteType: "downvote" };

    // Make the PUT request
    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    // Ensure status is 200
    expect(response.status).toBe(200);

    // Ensure response body contains the expected structure
    expect(response.body).toHaveProperty("data");
    const updatedPost = response.body.data;
    expect(updatedPost).toHaveProperty("post_id", 14);
    expect(updatedPost).toHaveProperty("downvotes");
    expect(updatedPost.downvotes).toBeGreaterThan(0); // Adjust this based on your test DB
  });

  it("should return 400 for an invalid vote type", async () => {
    const payload = { post_id: 14, voteType: "invalid_vote" };

    // Make the PUT request
    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    // Ensure status is 400
    expect(response.status).toBe(400);

    // Ensure response contains an error message
    expect(response.body).toHaveProperty("error", "Invalid vote type");
  });

  it("should return 500 if the database query fails", async () => {
    const payload = { post_id: "test", voteType: "upvote" }; // Assuming 9999 doesn't exist or triggers a failure

    // Make the PUT request
    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    // Ensure status is 500
    expect(response.status).toBe(500);

    // Ensure response contains an error message
    expect(response.body).toHaveProperty("error", "Internal server error");
  });
});
