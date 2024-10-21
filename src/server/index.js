import express from "express";
const app = express();
const port = 3000;
import { query } from "../db/index.js";

app.use(express.json());
//app.set("view engine", "ejs");

//create user
app.post("/register", async (req, res) => {
  console.log(req.body); // This will now log the request body
  try {
    const results = await query(
      "INSERT INTO users (name, password, role) VALUES ($1, $2, $3)",
      [req.body.name, req.body.password, req.body.role]
    );
    console.log(results);
    res.status(201).json({
      username: req.body.name,
      password: req.body.password,
      role: req.body.role,
    });
  } catch (error) {
    console.log(error);
  }
});

//get user
app.get("/api/v1/users/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await query("SELECT * FROM users WHERE users_id = $1", [
      req.params.id,
    ]);
    res.status(201).json({
      data: results.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//proposal
//create
app.post(
  "/api/v1/proposal/:stock_id/:advisor_id/:investor_id",
  async (req, res) => {
    console.log(req.body); // This will now log the request body
    try {
      const results = await query(
        "INSERT INTO propose (content, quantity, stock_id, advisor_id, investor_id) VALUES ($1, $2, $3, $4, $5)",
        [
          req.body.content,
          req.body.quantity,
          req.params.stock_id,
          req.params.advisor_id,
          req.params.investor_id,
        ]
      );
      console.log(results);
      res.status(201).json({
        content: req.body.content,
        quantity: req.body.quantity,
        stock_id: req.body.stock_id,
        advisor_id: req.body.advisor_id,
        investor_id: req.body.investor_id,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//get all
app.get("/api/v1/users/:investor_id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await query(
      "SELECT * FROM proposal WHERE investor_id = $1",
      [req.params.investor_id]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//review
/*app.post(
  "/api/v1/proposal/:advisor_id",
  async (req, res) => {
    console.log(req.body); // This will now log the request body
    try {
      const results = await query(
        "INSERT INTO propose (investor_id, advisor_id, rating, feedback) VALUES ($1, $2, $3, $4)",
        [
          req.body.investor_id,
          req.body.advisor_id,
          req.body.rating,
          req.body.feedback
        ]
      );
      console.log(results);
      res.status(201).json({
        investor_id: req.body.investor_id,
        advisor_id: req.body.advisor_id,
        rating: req.body.rating,
        feedback: req.body.feedback
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//get all
app.get("/api/v1/users/:investor_id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await query(
      "SELECT * FROM proposal WHERE investor_id = $1",
      [req.params.investor_id]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
 */

//post
/* */

//update a proposal

//update post which then updates the portfolio?

/*app.get("/test", async (req, res) => {
  const results = await query("SELECT * FROM users");
  console.log(results.rows);
});*/

//
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port} `);
});
