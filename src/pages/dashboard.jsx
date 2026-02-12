import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function getPlayerId() {
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 20,
        padding: 24,
        flex: 1,
        minWidth: 200,
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.6 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
        {value}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const playerId = useMemo(() => getPlayerId(), []);
  const [days, setDays] = useState(30);

  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [byLevel, setByLevel] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/stats/summary?playerId=${playerId}&game=math`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(console.log);

    fetch(
      `http://localhost:3001/stats/daily?playerId=${playerId}&game=math&days=${days}`
    )
      .then((r) => r.json())
      .then(setDaily)
      .catch(console.log);

    fetch(`http://localhost:3001/stats/by-level?playerId=${playerId}&game=math`)
      .then((r) => r.json())
      .then(setByLevel)
      .catch(console.log);
  }, [playerId, days]);

  if (!summary) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 40,
          background: "linear-gradient(135deg,#f5f7ff,#eef1ff)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Lädt...
      </div>
    );
  }

  // ✅ MySQL AVG() kommt oft als String -> Number(...) ist wichtig
  const sessions = summary.sessions ? Number(summary.sessions) : 0;

  const avgScore = summary.avgScore
    ? Number(summary.avgScore).toFixed(2)
    : "0.00";

  const bestScore = summary.bestScore ? Number(summary.bestScore) : 0;

  const accuracy = summary.avgAccuracy
    ? Math.round(Number(summary.avgAccuracy) * 100)
    : 0;

  const duration = summary.avgDuration
    ? Math.round(Number(summary.avgDuration))
    : 0;

  const dailyChart = daily.map((d) => ({
    tag: String(d.day).slice(5),
    sessions: d.sessions ? Number(d.sessions) : 0,
    score: d.avgScore ? Number(d.avgScore) : 0,
  }));

  const levelChart = byLevel.map((l) => ({
    level: l.level,
    sessions: l.sessions ? Number(l.sessions) : 0,
    genauigkeit: l.avgAccuracy ? Math.round(Number(l.avgAccuracy) * 100) : 0,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "linear-gradient(135deg,#f5f7ff,#eef1ff)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>Dashboard</h1>
          <div style={{ opacity: 0.6, fontSize: 14 }}>Statistik – Mathematik</div>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
          }}
        >
          <option value={7}>7 Tage</option>
          <option value={30}>30 Tage</option>
          <option value={90}>90 Tage</option>
        </select>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        <StatCard title="Sitzungen" value={sessions} />
        <StatCard title="Ø Score" value={avgScore} />
        <StatCard title="Bester Score" value={bestScore} />
        <StatCard title="Genauigkeit" value={`${accuracy}%`} />
        <StatCard title="Ø Dauer" value={`${duration}s`} />
      </div>

      {/* LINE CHART */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 30,
          marginBottom: 40,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Entwicklung</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dailyChart}>
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
      </div>

      {/* BAR CHART */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Nach Level</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={levelChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#6366f1" />
              <Bar dataKey="genauigkeit" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.5 }}>
        Player-ID: {playerId}
      </div>
    </div>
  );
}
