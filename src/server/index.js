import express from "express";
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("here");
  res.render("index");
});

app.listen(3000);
