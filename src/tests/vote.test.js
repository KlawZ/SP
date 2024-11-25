import request from "supertest";
import app from "../server/index.js";

describe("PUT /api/v1/posts/vote", () => {
  it("should increment upvotes for a valid upvote request", async () => {
    const payload = { post_id: 14, voteType: "upvote" };

    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");
    const updatedPost = response.body.data;
    expect(updatedPost).toHaveProperty("post_id", 14);
    expect(updatedPost).toHaveProperty("upvotes");
    expect(updatedPost.upvotes).toBeGreaterThan(0);
  });

  it("should increment downvotes for a valid downvote request", async () => {
    const payload = { post_id: 14, voteType: "downvote" };

    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");
    const updatedPost = response.body.data;
    expect(updatedPost).toHaveProperty("post_id", 14);
    expect(updatedPost).toHaveProperty("downvotes");
    expect(updatedPost.downvotes).toBeGreaterThan(0);
  });

  it("should return 400 for an invalid vote type", async () => {
    const payload = { post_id: 14, voteType: "invalid_vote" };

    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty("error", "Invalid vote type");
  });

  it("should return 500 if the database query fails", async () => {
    const payload = { post_id: "test", voteType: "upvote" };

    const response = await request(app).put("/api/v1/posts/vote").send(payload);

    expect(response.status).toBe(500);

    expect(response.body).toHaveProperty("error", "Internal server error");
  });
});
