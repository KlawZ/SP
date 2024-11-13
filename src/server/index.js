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

// get all users
app.get("/api/v1/admin/users", async (req, res) => {
  try {
    const results = await query("SELECT * FROM users");
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

// get all posts
app.get("/api/v1/admin/posts", async (req, res) => {
  try {
    const results = await query("SELECT * FROM posts");
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

// delete a post
app.delete("/api/v1/admin/posts", async (req, res) => {
  try {
    const results = await query("DELETE FROM posts WHERE post_id = $1", [
      req.query.post_id,
    ]);
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

// delete a user
app.delete("/api/v1/admin/users", async (req, res) => {
  try {
    const results = await query("DELETE FROM users WHERE users_id = $1", [
      req.query.users_id,
    ]);
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
/*
//get all advisors
app.get("/api/v1/advisors", async (req, res) => {
  try {
    const role = "advisor";
    const results = await query(
      "SELECT users_id, name FROM users WHERE role = $1",
      [role]
    );
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving advisors." });
  }
});*/

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
    const results = await query(
      "SELECT * FROM proposals WHERE investor_id = $1",
      [req.body.investor_id]
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
  const { advisor_id } = req.query;
  try {
    const results = await query(
      "SELECT * FROM proposals WHERE advisor_id = $1 AND accepted IS NULL",
      [advisor_id]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//review
app.post("/api/v1/investors/reviews", async (req, res) => {
  try {
    const results = await query(
      "INSERT INTO reviews (investor_id, advisor_id, rating, feedback) VALUES ($1, $2, $3, $4)",
      [
        req.body.investor_id,
        req.body.advisor_id,
        req.body.rating,
        req.body.feedback,
      ]
    );
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all
app.get("/api/v1/advisors/reviews", async (req, res) => {
  const { advisor_id } = req.query;
  try {
    const results = await query("SELECT * FROM reviews WHERE advisor_id = $1", [
      advisor_id,
    ]);
    res.status(201).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//post
app.post("/api/v1/advisors/posts", async (req, res) => {
  try {
    const results = await query(
      "INSERT INTO posts (content, advisor_id, upvotes, downvotes) VALUES ($1, $2, $3, $4)",
      [req.body.content, req.body.advisor_id, 0, 0]
    );
    res.status(201).json({
      data: results.rows,
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
  const { post_id, voteType } = req.body;
  console.log("Received post_id:", post_id, "voteType:", voteType); // voteType can be 'upvote' or 'downvote'

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

app.put("/api/v1/proposals/update", async (req, res) => {
  const { proposal_id, accepted } = req.body;

  try {
    // Step 1: Update the proposal's accepted status
    const proposalResult = await query(
      "UPDATE proposals SET accepted = $1 WHERE proposal_id = $2 RETURNING *",
      [accepted, proposal_id]
    );

    if (accepted) {
      // Step 2: Retrieve the proposal details, including stock symbol and quantity
      const proposal = proposalResult.rows[0];
      const priceResult = await query(
        "SELECT current_price FROM stocks WHERE symbol = $1",
        [proposal.stock_id]
      );

      // Step 3: Calculate the amount (quantity * current_price)
      const price = priceResult.rows[0].current_price;
      const amount = proposal.quantity * price;

      // Step 4: Insert the transaction record
      await query(
        "INSERT INTO transactions (proposal_id, amount, type) VALUES ($1, $2, $3)",
        [proposal_id, amount, proposal.type]
      );

      // Step 5: Handle "buy" and "sell" types in the stock_users table
      if (proposal.type === "buy") {
        // Increase quantity for "buy" type
        await query(
          "INSERT INTO stock_users (users_id, stock_symbol, quantity) VALUES ($1, $2, $3) " +
            "ON CONFLICT (users_id, stock_symbol) DO UPDATE SET quantity = stock_users.quantity + $3",
          [proposal.investor_id, proposal.stock_id, proposal.quantity]
        );

        // Deduct amount from user's balance for "buy"
        await query(
          "UPDATE users SET balance = balance - $1 WHERE users_id = $2",
          [amount, proposal.investor_id]
        );
      } else if (proposal.type === "sell") {
        // Decrease quantity for "sell" type
        const currentQuantityResult = await query(
          "SELECT quantity FROM stock_users WHERE users_id = $1 AND stock_symbol = $2",
          [proposal.investor_id, proposal.stock_id]
        );

        const currentQuantity = currentQuantityResult.rows[0]?.quantity || 0;
        console.log(currentQuantity);
        const newQuantity = currentQuantity - proposal.quantity;
        console.log(proposal.quantity);
        console.log(newQuantity);

        if (newQuantity > 0) {
          // Update the quantity if there's still some stock left
          await query(
            "UPDATE stock_users SET quantity = $1 WHERE users_id = $2 AND stock_symbol = $3",
            [newQuantity, proposal.investor_id, proposal.stock_id]
          );
        } else {
          // Delete the record if the quantity reaches zero or below
          await query(
            "DELETE FROM stock_users WHERE users_id = $1 AND stock_symbol = $2",
            [proposal.investor_id, proposal.stock_id]
          );
        }
        // Add amount to user's balance for "sell"
        await query(
          "UPDATE users SET balance = balance + $1 WHERE users_id = $2",
          [amount, proposal.investor_id]
        );
      }

      return res.status(200).json({
        message:
          "Proposal accepted, transaction recorded, and portfolio updated.",
      });
    }

    // Response for declined proposal
    res.status(200).json({
      message: "Proposal declined.",
    });
  } catch (error) {
    console.error(error);
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

//get all stocks belonging to a specific investor
app.get("/api/v1/stocks/investor", async (req, res) => {
  const { userID } = req.query;
  try {
    const results = await query(
      "SELECT symbol, current_price, time FROM stocks s INNER JOIN stock_users su ON s.symbol = su.stock_symbol WHERE su.users_id = $1",
      [userID]
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

// Get all stock values
app.get("/api/v1/investor/stocks", async (req, res) => {
  const { userID } = req.query;

  try {
    // Step 1: Retrieve the user's portfolio
    const portfolioResults = await query(
      "SELECT stock_symbol, quantity FROM stock_users WHERE users_id = $1",
      [userID]
    );

    const portfolio = portfolioResults.rows; // Array of stocks with symbol and quantity

    // Step 2: Fetch current price for each stock and calculate value
    const stockValues = await Promise.all(
      portfolio.map(async (stock) => {
        const priceResult = await query(
          "SELECT current_price FROM stocks WHERE symbol = $1",
          [stock.stock_symbol]
        );

        const price = priceResult.rows[0]?.current_price || 0;
        const value = price * stock.quantity;

        return {
          symbol: stock.stock_symbol,
          value: value,
        };
      })
    );

    // Step 3: Send the results
    res.status(200).json({
      data: stockValues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port} `);
});
