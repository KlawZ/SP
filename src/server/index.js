import express, { response } from "express";
import { startDataInsertion } from "./data_insertion.js";
import cors from "cors";
import bcrypt from "bcrypt";
import { query } from "../db/index.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//create user
app.post("/api/v1/users", async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let results;
    if (req.body.role === "investor") {
      results = await query(
        "INSERT INTO users (name, password, role, balance) VALUES ($1, $2, $3, $4) RETURNING *",
        [req.body.name, hashedPassword, req.body.role, 10000]
      );
    } else {
      results = await query(
        "INSERT INTO users (name, password, role) VALUES ($1, $2, $3) RETURNING *",
        [req.body.name, hashedPassword, req.body.role]
      );
    }

    console.log(results.rows[0]);
    res.status(201).json({
      username: req.body.name,
      role: req.body.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
//get user
app.get("/api/v1/users/", async (req, res) => {
  const { name, password } = req.query;

  try {
    const userResult = await query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful");
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all users
app.get("/api/v1/admin/users", async (req, res) => {
  try {
    const results = await query("SELECT * FROM users");
    res.status(200).json({
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
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//delete a user
app.delete("/api/v1/admin/users", async (req, res) => {
  try {
    await query(
      `
      WITH deleted_transactions AS (
        DELETE FROM transactions WHERE proposal_id IN (SELECT proposal_id FROM proposals WHERE investor_id = $1 or advisor_id = $1)
      ), 
      deleted_stock_users AS (
        DELETE FROM stock_users WHERE users_id = $1
      ),
      deleted_reviews AS (
        DELETE FROM reviews WHERE advisor_id = $1 OR investor_id = $1
      ),
      deleted_posts AS (
        DELETE FROM posts WHERE advisor_id = $1
      ),
      deleted_proposals AS (
        DELETE FROM proposals WHERE advisor_id = $1 OR investor_id = $1
      )
      DELETE FROM users WHERE users_id = $1;
      `,
      [req.query.users_id]
    );

    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user and related data",
    });
  }
});

//create proposal
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
    res.status(200).json({
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
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//create review
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

//get all for advisor
app.get("/api/v1/advisors/reviews", async (req, res) => {
  const { advisor_id } = req.query;
  try {
    const results = await query("SELECT * FROM reviews WHERE advisor_id = $1", [
      advisor_id,
    ]);
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//create post
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
    res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//update a post
app.put("/api/v1/posts/vote", async (req, res) => {
  const { post_id, voteType } = req.body;

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
    console.log(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//update proposals
app.put("/api/v1/proposals/update", async (req, res) => {
  const { proposal_id, accepted } = req.body;

  try {
    const proposalResult = await query(
      "UPDATE proposals SET accepted = $1 WHERE proposal_id = $2 RETURNING *",
      [accepted, proposal_id]
    );

    if (accepted) {
      const proposal = proposalResult.rows[0];
      const priceResult = await query(
        "SELECT current_price FROM stocks WHERE symbol = $1",
        [proposal.stock_id]
      );

      const price = priceResult.rows[0].current_price;
      const amount = proposal.quantity * price;

      await query(
        "INSERT INTO transactions (proposal_id, amount, type) VALUES ($1, $2, $3)",
        [proposal_id, amount, proposal.type]
      );

      if (proposal.type === "buy") {
        await query(
          "INSERT INTO stock_users (users_id, stock_symbol, quantity) VALUES ($1, $2, $3) " +
            "ON CONFLICT (users_id, stock_symbol) DO UPDATE SET quantity = stock_users.quantity + $3",
          [proposal.investor_id, proposal.stock_id, proposal.quantity]
        );

        await query(
          "UPDATE users SET balance = balance - $1 WHERE users_id = $2",
          [amount, proposal.investor_id]
        );
      } else if (proposal.type === "sell") {
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
          await query(
            "UPDATE stock_users SET quantity = $1 WHERE users_id = $2 AND stock_symbol = $3",
            [newQuantity, proposal.investor_id, proposal.stock_id]
          );
        } else {
          await query(
            "DELETE FROM stock_users WHERE users_id = $1 AND stock_symbol = $2",
            [proposal.investor_id, proposal.stock_id]
          );
        }
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
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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
    const portfolioResults = await query(
      "SELECT stock_symbol, quantity FROM stock_users WHERE users_id = $1",
      [userID]
    );

    const portfolio = portfolioResults.rows;

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

    res.status(200).json({
      data: stockValues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;

if (process.argv[1].endsWith("index.js")) {
  startDataInsertion();
  app.listen(port, () => {
    console.log(`Server is up and listening on port ${port} `);
  });
}
