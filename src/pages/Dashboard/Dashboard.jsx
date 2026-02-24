// Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./Dashboard.css";

function getPlayerId() {
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

function getDisplayName() {
  return (
    localStorage.getItem("display_name") ||
    localStorage.getItem("username") ||
    "Gast"
  );
}

function n(v, fallback = 0) {
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

function pct(v) {
  return `${Math.round(n(v) * 100)}%`;
}

function shortId(id) {
  if (!id) return "";
  return id.slice(0, 8) + "…" + id.slice(-4);
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("display_name");
  localStorage.removeItem("player_id");
  localStorage.removeItem("username");
  localStorage.removeItem("user_id");
  window.location.href = "/login";
}

function Kpi({ label, value }) {
  return (
    <div className="db-kpi">
      <div className="db-kpi-label">{label}</div>
      <div className="db-kpi-value">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const playerId = useMemo(() => getPlayerId(), []);
  const displayName = useMemo(() => getDisplayName(), []);

  const [overall, setOverall] = useState(null);
  const [byGame, setByGame] = useState([]);

  // Chart data (par session)
  const [sessionSeries, setSessionSeries] = useState([]);
  const [dailyGame, setDailyGame] = useState("all");

  // overall + by game
  useEffect(() => {
    fetch(`http://localhost:3001/stats/overall?playerId=${playerId}`)
      .then((r) => r.json())
      .then(setOverall)
      .catch(console.log);

    fetch(`http://localhost:3001/stats/by-game?playerId=${playerId}`)
      .then((r) => r.json())
      .then(setByGame)
      .catch(console.log);
  }, [playerId]);

  // sessions chart (par partie)
  useEffect(() => {
    fetch(
      `http://localhost:3001/stats/sessions?playerId=${playerId}&game=${dailyGame}&limit=60`
    )
      .then((r) => r.json())
      .then((rows) => setSessionSeries(rows || []))
      .catch(console.log);
  }, [playerId, dailyGame]);

  const gameRows = useMemo(() => {
    const base = {
      math: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      vocab: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      conjugation: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
    };
    for (const row of byGame || []) {
      if (row?.game && base[row.game]) base[row.game] = row;
    }
    return [
      { key: "math", label: "Mathe", ...base.math },
      { key: "vocab", label: "Vokabeln", ...base.vocab },
      { key: "conjugation", label: "Konjugation", ...base.conjugation },
    ];
  }, [byGame]);

  return (
    <div className="db-page">
      <div className="db-shell">
        {/* LEFT */}
        <aside className="db-side">
          <div className="db-profile">
            <div className="db-welcome">Willkommen</div>
            <div className="db-name">{displayName}</div>
            <div className="db-sub">Edu-Exos • Dashboard</div>

            <div className="db-idRow">
              <span className="db-idLabel">Player-ID</span>
              <span className="db-idValue" title={playerId}>
                {shortId(playerId)}
              </span>
            </div>

            <button className="db-logout" onClick={handleLogout}>
              Abmelden
            </button>
          </div>

          <div className="db-menu">
            <div className="db-menu-title">Übungen</div>

            <Link to="/math" className="db-menu-btn">
              Mathe <span>→</span>
            </Link>

            <Link to="/vocab" className="db-menu-btn">
              Vokabeln <span>→</span>
            </Link>

            <Link to="/conjugation" className="db-menu-btn">
              Konjugation <span>→</span>
            </Link>

            <div className="db-menu-hint">
              Tipp: Spiele ein paar Sessions, dann erscheinen mehr Daten in den
              Kurven.
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="db-main">
          {/* KPI */}
          <section className="db-panel">
            <div className="db-panel-head">
              <div>
                <div className="db-panel-title">Gesamt</div>
                <div className="db-panel-sub">Schneller Überblick</div>
              </div>
              <div className="db-pill">Aktiv</div>
            </div>

            {!overall ? (
              <div className="db-loading">Lädt Statistiken…</div>
            ) : (
              <div className="db-kpis">
                <Kpi label="Sitzungen" value={n(overall.sessions)} />
                <Kpi label="Ø Score" value={n(overall.avgScore).toFixed(2)} />
                <Kpi label="Best" value={n(overall.bestScore)} />
                <Kpi label="Genauigkeit" value={pct(overall.avgAccuracy)} />
                <Kpi label="Ø Dauer" value={`${Math.round(n(overall.avgDuration))}s`} />
              </div>
            )}
          </section>

          {/* TABLE + CHART */}
          <section className="db-panel">
            <div className="db-split">
              {/* TABLE */}
              <div className="db-block">
                <div className="db-block-head">
                  <div className="db-block-title">Spiele</div>
                  <div className="db-block-sub">Statistiken pro Spiel</div>
                </div>

                <div className="db-table">
                  <div className="db-tr db-th">
                    <div>Spiel</div>
                    <div>Sitz.</div>
                    <div>Ø Score</div>
                    <div>Best</div>
                    <div>Genauigkeit</div>
                  </div>

                  {gameRows.map((g) => (
                    <div className="db-tr" key={g.key}>
                      <div className="db-gameName">{g.label}</div>
                      <div>{n(g.sessions)}</div>
                      <div>{n(g.avgScore).toFixed(2)}</div>
                      <div>{n(g.bestScore)}</div>
                      <div>{pct(g.avgAccuracy)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHART */}
              <div className="db-block">
                <div className="db-block-headRow">
                  <div>
                    <div className="db-block-title">Verlauf (Sessions)</div>
                    <div className="db-block-sub">Letzte 60 Sessions</div>
                  </div>

                  <div className="db-controls">
                    <select
                      className="db-select"
                      value={dailyGame}
                      onChange={(e) => setDailyGame(e.target.value)}
                    >
                      <option value="all">Alle</option>
                      <option value="math">Mathe</option>
                      <option value="vocab">Vokabeln</option>
                      <option value="conjugation">Konjugation</option>
                    </select>
                  </div>
                </div>

                <div className="db-chart">
                  {sessionSeries.length === 0 ? (
                    <div className="db-loading">Noch keine Daten…</div>
                  ) : (
                    <div className="db-chartInner">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sessionSeries} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 10" />

                          <XAxis
                            dataKey="idx"
                            stroke="rgba(255,255,255,0.50)"
                            tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            stroke="rgba(255,255,255,0.50)"
                            tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, "dataMax + 2"]}
                            width={36}
                          />

                          <Tooltip
                            cursor={{ stroke: "rgba(255,255,255,0.10)", strokeWidth: 1 }}
                            contentStyle={{
                              background: "rgba(10,15,31,0.95)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: 14,
                              color: "white",
                              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                            }}
                            labelStyle={{ fontWeight: 900 }}
                          />

                          <Line
                            type="stepAfter"
                            dataKey="score"
                            name="Score"
                            stroke="#20E3FF"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}