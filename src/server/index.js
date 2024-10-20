import express from "express";
const app = express();
const port = 3000;
import { query } from "../db/index.js";

app.use(express.json());
//app.set("view engine", "ejs");

//create user
app.post("/register", (req, res) => {
  console.log(req.body); // This will now log the request body
  res.status(201).json({
    username: "Kledis",
    password: "Password",
  });
});

app.get("/test", async (req, res) => {
  const results = await query("SELECT * FROM users");
  console.log(results.rows);
});
//
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port} `);
});
