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
  console.log("BODY:", req.body);

  const { playerId, game, score, total, level, durationSec } = req.body;

  const sql = `
    INSERT INTO sessions (player_id, game, score, total, level, duration_sec)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [playerId, game, score, total, level, durationSec || 0],
    (err) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.status(500).send("Error");
      }
      res.send("OK");
    }
  );
});


app.get("/stats/summary", (req, res) => {
  const { playerId, game = "math" } = req.query;

   if (!playerId) {
    return res.status(400).json({ error: "playerId missing" });
  }

  const sql = `
    SELECT
      COUNT(*) AS sessions,
      AVG(score) AS avgScore,
      MAX(score) AS bestScore,
      AVG(duration_sec) AS avgDuration,
      AVG(score / NULLIF(total,0)) AS avgAccuracy
    FROM sessions
    WHERE player_id = ? AND game = ?
  `;

  db.query(sql, [playerId, game], (err, rows) => {
    if (err) return res.status(500).send("Error");
    res.json(rows[0]);
  });
});

app.get("/stats/daily", (req, res) => {
  const { playerId, game = "math", days = 30 } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  const sql = `
    SELECT
      DATE(created_at) AS day,
      COUNT(*) AS sessions,
      AVG(score) AS avgScore,
      AVG(score / NULLIF(total,0)) AS avgAccuracy
    FROM sessions
    WHERE player_id = ? AND game = ?
      AND created_at >= NOW() - INTERVAL ? DAY
    GROUP BY day
    ORDER BY day
  `;

  db.query(sql, [playerId, game, Number(days)], (err, rows) => {
    if (err) return res.status(500).send("Error");
    res.json(rows);
  });
});

app.get("/stats/by-level", (req, res) => {
  const { playerId, game = "math" } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  const sql = `
    SELECT
      level,
      COUNT(*) AS sessions,
      AVG(score) AS avgScore,
      AVG(score / NULLIF(total,0)) AS avgAccuracy
    FROM sessions
    WHERE player_id = ? AND game = ?
    GROUP BY level
    ORDER BY FIELD(level,'easy','medium','hard')
  `;

  db.query(sql, [playerId, game], (err, rows) => {
    if (err) return res.status(500).send("Error");
    res.json(rows);
  });
});


app.listen(3001, () => {
  console.log("Server khdam f 3001");
});