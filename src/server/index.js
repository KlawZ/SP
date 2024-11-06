import express from "express";
import cors from "cors";
import { query } from "../db/index.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//create user
app.post("/api/v1/users", async (req, res) => {
  try {
    let results;
    if (req.body.role === "investor") {
      results = await query(
        "INSERT INTO users (name, password, role, balance) VALUES ($1, $2, $3, $4) RETURNING *",
        [req.body.name, req.body.password, req.body.role, 10000]
      );
    } else {
      results = await query(
        "INSERT INTO users (name, password, role) VALUES ($1, $2, $3) RETURNING *",
        [req.body.name, req.body.password, req.body.role]
      );
    }
    console.log(results.rows[0]);
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
app.get("/api/v1/users/", async (req, res) => {
  const { name, password } = req.query;

  try {
    const userResult = await query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [name, password]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0];
    console.log("running");
    res.status(201).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all advisors
app.get("/api/v1/advisors", async (req, res) => {
  try {
    const role = "advisor";
    const results = await query(
      "SELECT users_id, name FROM users WHERE role = $1",
      [role]
    ); // Adjust query based on your database structure
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving advisors." });
  }
});

//proposal
//create
app.post("/api/v1/proposal", async (req, res) => {
  try {
    const results = await query(
      "INSERT INTO proposals (content, quantity, stock_id, advisor_id, investor_id, type) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        req.body.content,
        req.body.quantity,
        req.body.stock_id,
        req.body.advisor_id,
        req.body.investor_id,
        req.body.type,
      ]
    );
    res.status(201).json({
      data: results.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//get all for investor
app.get("/api/v1/investors/proposals", async (req, res) => {
  try {
    console.log(req.session.advisor_id);
    if (!req.session.investor_id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const results = await query(
      "SELECT * FROM proposals WHERE investor_id = $1",
      [req.session.investor_id]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all for advisor
app.get("/api/v1/advisors/proposals", async (req, res) => {
  try {
    console.log(req.session.advisor_id);
    if (!req.session.investor_id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const results = await query(
      "SELECT * FROM proposals WHERE advisor_id = $1",
      [req.session.advisor_id]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//review
app.post("/api/v1/advisors/:advisor_id/reviews", async (req, res) => {
  try {
    const results = await query(
      "INSERT INTO review (investor_id, advisor_id, rating, feedback) VALUES ($1, $2, $3, $4)",
      [
        req.body.investor_id,
        req.body.advisor_id,
        req.body.rating,
        req.body.feedback,
      ]
    );
    res.status(201).json({
      investor_id: req.body.investor_id,
      advisor_id: req.body.advisor_id,
      rating: req.body.rating,
      feedback: req.body.feedback,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all
app.get("/api/v1/advisors/reviews", async (req, res) => {
  try {
    console.log(req.session.advisor_id);
    if (!req.session.advisor_id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const results = await query("SELECT * FROM reviews WHERE advisor_id = $1", [
      req.session.advisor_id,
    ]);
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//post
app.post("/api/v1/advisors/:advisor_id/posts", async (req, res) => {
  try {
    const results = await query(
      "INSERT INTO post (content, advisor_id) VALUES ($1, $2)",
      [req.body.advisor_id, req.body.content]
    );
    req.session.post_id = res.status(201).json({
      advisor_id: req.body.advisor_id,
      content: req.body.content,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all
app.get("/api/v1/investors/posts", async (req, res) => {
  try {
    const results = await query("SELECT * FROM posts");
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//update a post
app.put("/api/v1/posts/vote", async (req, res) => {
  const { post_id, voteType } = req.body; // voteType can be 'upvote' or 'downvote'

  try {
    let queryText;
    if (voteType === "upvote") {
      queryText =
        "UPDATE posts SET upvotes = upvotes + 1 WHERE post_id = $1 RETURNING *";
    } else if (voteType === "downvote") {
      queryText =
        "UPDATE posts SET downvotes = downvotes + 1 WHERE post_id = $1 RETURNING *";
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    const result = await query(queryText, [post_id]);

    res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update proposal which then updates the portfolio? and then updates the transaction table
app.put("/api/v1/proposals/update", async (req, res) => {
  const { proposal_id, type, symbol, accepted, price } = req.body;

  try {
    const proposalResult = await query(
      "UPDATE proposal SET accepted = $1 WHERE id = $2 RETURNING *",
      [accepted, proposal_id]
    );
    if (proposalResult.rowCount === 0) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    if (accepted) {
      const proposal = proposalResult.rows[0]; // Get the proposal details

      /*const price = await query(
        "SELECT current_price FROM proposals INNER JOIN stocks ON proposals.stock_id = stocks.symbol WHERE stocks.symbol = 'AAPL'"
      );*/

      // Insert into the transactions table (assuming it has these columns)
      await query(
        "INSERT INTO transactions (proposal_id, amount, type) VALUES ($1, $2, $3)",
        [proposal.proposal_id, proposal.quantity] // times something
      );

      await query(
        "INSERT INTO portfolio (user_id, stock_id, quantity) VALUES ($1, $2, $3) " +
          "ON CONFLICT (user_id, stock_id) DO UPDATE SET quantity = portfolio.quantity + $3",
        [proposal.investor_id, proposal.stock_id, proposal.quantity]
      );
    }

    res.status(200).json({
      message: accepted
        ? "Proposal accepted and transaction recorded."
        : "Proposal declined.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all stocks
app.get("/api/v1/stocks", async (req, res) => {
  try {
    const results = await query(
      "SELECT symbol, current_price, time FROM stocks"
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all advisors
app.get("/api/v1/advisors", async (req, res) => {
  try {
    const results = await query("SELECT * FROM users WHERE role = 'advisor'");
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port} `);
});
