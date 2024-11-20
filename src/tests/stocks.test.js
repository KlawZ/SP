import request from "supertest";
import app from "../server/index.js"; // Adjust the path to your app file

describe("GET /api/v1/stocks", () => {
  it("should return a list of stocks", async () => {
    const response = await request(app).get("/api/v1/stocks");

    // Check that the status code is 201 (Created)
    expect(response.status).toBe(200);

    // Check that the response body contains a "data" property
    expect(response.body).toHaveProperty("data");

    // Check that "data" is an array
    expect(Array.isArray(response.body.data)).toBe(true);

    // If there are items in the array, check their structure
    if (response.body.data.length > 0) {
      const stock = response.body.data[0];
      expect(stock).toHaveProperty("symbol");
      expect(stock).toHaveProperty("current_price");
      expect(stock).toHaveProperty("time");
    }
  });
});
