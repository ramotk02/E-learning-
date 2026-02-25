const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "CHANGE_ME_SECRET";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "e-leraning",
});

// optional: DB errors loggen (verhindert "silent" crashes)
db.on("error", (err) => {
  console.log("DB ERROR:", err);
});

/* =========================
   AUTH
========================= */

// REGISTER
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "username/password missing" });

    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, hash],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(409).json({ error: "Username already used" });
          console.log(err);
          return res.status(500).json({ error: "Server error" });
        }

        const user = { id: result.insertId, username };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
      }
    );
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "username/password missing" });

  db.query(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (!rows || rows.length === 0)
        return res.status(401).json({ error: "Invalid login" });

      const u = rows[0];
      const ok = await bcrypt.compare(password, u.password_hash);
      if (!ok) return res.status(401).json({ error: "Invalid login" });

      const user = { id: u.id, username: u.username };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user });
    }
  );
});

/* =========================
   SAVE SESSION
========================= */
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

/* =========================
   STATS
========================= */

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
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.json(rows[0]);
  });
});

// ✅ BY-GAME: Stats pro Spiel
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
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.json(rows);
  });
});

// ✅ OVERALL: Stats über alle Spiele
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

// ✅ DAILY: 1 point par jour (moyennes)
app.get("/stats/daily", (req, res) => {
  const { playerId, game = "all", days = 30 } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  let sql = `
    SELECT
      DATE(created_at) AS day,
      COUNT(*) AS sessions,
      AVG(score / NULLIF(total,0)) AS avgAccuracy,
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
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }
    res.json(rows);
  });
});



app.get("/stats/sessions", (req, res) => {
  const { playerId, game = "all", limit = 60 } = req.query;

  if (!playerId) return res.status(400).json({ error: "playerId missing" });

  let sql = `
    SELECT id, score, total, game, created_at
    FROM sessions
    WHERE player_id = ?
  `;

  const params = [playerId];

  if (game !== "all") {
    sql += " AND game = ?";
    params.push(game);
  }

  sql += `
    ORDER BY created_at ASC
    LIMIT ?
  `;

  params.push(Math.min(Number(limit) || 60, 200));

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).send("Error");
    }

    const out = (rows || []).map((r, i) => ({
      idx: i + 1,
      score: Number(r.score),
      total: Number(r.total),
      accuracy: r.total ? Number((r.score / r.total).toFixed(3)) : 0,
      day: String(r.created_at).slice(5, 10),
      game: r.game,
    }));

    res.json(out);
  });
});
app.get("/leaderboard/vocab", (req, res) => {
  const sql = `
    SELECT
      u.username,
      MAX(s.score) AS bestScore,
      AVG(s.score / NULLIF(s.total,0)) AS avgAccuracy
    FROM sessions s
    JOIN users u ON u.id = s.player_id
    WHERE s.game = 'vocab'
    GROUP BY s.player_id
    ORDER BY bestScore DESC
    LIMIT 10
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});



app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
