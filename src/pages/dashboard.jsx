import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

function getPlayerId() {
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

export default function Dashboard() {
  const playerId = useMemo(() => getPlayerId(), []);
  const [gameFilter, setGameFilter] = useState("all");
  const [daily, setDaily] = useState([]);
  const [byGame, setByGame] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/stats/daily?playerId=${playerId}&game=${gameFilter}`)
      .then(r => r.json())
      .then(setDaily);

    fetch(`http://localhost:3001/stats/by-game?playerId=${playerId}`)
      .then(r => r.json())
      .then(setByGame);
  }, [playerId, gameFilter]);

  const lineData = daily.map(d => ({
    tag: String(d.day).slice(5),
    sessions: Number(d.sessions || 0),
    score: Number(d.avgScore || 0)
  }));

  const pieData = byGame.map(g => ({
    name: g.game,
    value: Number(g.sessions || 0)
  }));

  return (
    <div style={{
      minHeight: "100vh",
      padding: 40,
      background: "linear-gradient(135deg,#f5f7ff,#eef1ff)",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{ marginBottom: 20 }}>Edu-Exos Dashboard</h1>

      {/* FILTER */}
      <div style={{ marginBottom: 30 }}>
        <select
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white"
          }}
        >
          <option value="all">Alle Spiele</option>
          <option value="math">Mathe</option>
          <option value="vocab">Vokabeln</option>
          <option value="conjugation">Konjugation</option>
        </select>
      </div>

      {/* LINE CHART */}
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: 30,
        marginBottom: 40,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        <h3>Entwicklung (letzte 30 Tage)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tag" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sessions" stroke="#6366f1" />
            <Line type="monotone" dataKey="score" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: 30,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        <h3>Spielverteilung</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
