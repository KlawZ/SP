import request from "supertest";
import app from "../server/index.js"; // Adjust the path to your app file

describe("GET /api/v1/stocks", () => {
  it("should return a list of stocks", async () => {
    const response = await request(app).get("/api/v1/stocks");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");

    expect(Array.isArray(response.body.data)).toBe(true);

    if (response.body.data.length > 0) {
      const stock = response.body.data[0];
      expect(stock).toHaveProperty("symbol");
      expect(stock).toHaveProperty("current_price");
      expect(stock).toHaveProperty("time");
    }
  });
});
