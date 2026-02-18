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
  database: "e-leraning", // genau so wie deine DB heißt
});

// optional: DB errors loggen (verhindert "silent" crashes)
db.on("error", (err) => {
  console.log("DB ERROR:", err);
});

// ✅ SAVE (Session speichern)
app.post("/save", (req, res) => {
  console.log("BODY:", req.body);

  const { playerId, game, score, total, level, durationSec } = req.body;

  if (!playerId || !game || score === undefined || total === undefined || !level) {
    return res.status(400).json({ error: "missing fields" });
  }

  const sql = `
    INSERT INTO sessions (player_id, game, score, total, level, duration_sec)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [playerId, game, score, total, level, durationSec || 0], (err) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.send("OK");
  });
});

// ✅ SUMMARY für ein Spiel (default math)
app.get("/stats/summary", (req, res) => {
  const { playerId, game = "math" } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

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

// ✅ DAILY (für "all" oder ein game)
app.get("/stats/daily", (req, res) => {
  const { playerId, game = "all", days = 30 } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  let sql = `
    SELECT
      DATE(created_at) AS day,
      COUNT(*) AS sessions,
      AVG(score) AS avgScore
    FROM sessions
    WHERE player_id = ?
      AND created_at >= NOW() - INTERVAL ? DAY
  `;

  const params = [playerId, Number(days)];

  if (game !== "all") {
    sql += " AND game = ?";
    params.push(game);
  }

  sql += " GROUP BY day ORDER BY day";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).send("Error");
    res.json(rows);
  });
});

// ✅ BY-GAME (neu): Stats pro Spiel
app.get("/stats/by-game", (req, res) => {
  const { playerId } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  const sql = `
    SELECT
      game,
      COUNT(*) AS sessions,
      AVG(score) AS avgScore,
      MAX(score) AS bestScore,
      AVG(score / NULLIF(total,0)) AS avgAccuracy
    FROM sessions
    WHERE player_id = ?
    GROUP BY game
    ORDER BY game
  `;

  db.query(sql, [playerId], (err, rows) => {
    if (err) return res.status(500).send("Error");
    res.json(rows);
  });
});
app.get("/stats/overall", (req, res) => {
  const { playerId } = req.query;

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
    WHERE player_id = ?
  `;

  db.query(sql, [playerId], (err, rows) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.json(rows[0]);
  });
});

app.listen(3001, () => {
  console.log("Server läuft auf Port 3001");
});