const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "e-leraning",
});


app.post("/save", (req, res) => {
  console.log("REQ BODY:", req.body);

  const { user, score, total, level } = req.body;

  const sql =
    "INSERT INTO math_stats (user_name, score, total, level) VALUES (?, ?, ?, ?)";

  db.query(sql, [user, score, total, level], (err) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.send("OK");
  });
});

app.listen(3001, () => {
  console.log("Server khdam f 3001");
});