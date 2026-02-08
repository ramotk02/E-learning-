const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// connexion l db
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "e-leraning",
});

// post
app.post("/save", (req, res) => {
  const { user, score } = req.body;

  const sql = "INSERT INTO math_stats (user_name, score) VALUES (?, ?)";
  db.query(sql, [user, score], (err) => {
    if (err) {
      res.status(500).send("Erreur");
    } else {
      res.send("OK");
    }
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});