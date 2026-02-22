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
  Legend,
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
  return localStorage.getItem("display_name") || "Gast";
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
  const [daily, setDaily] = useState([]);
  const [days, setDays] = useState(30);
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

  // daily chart
  useEffect(() => {
    fetch(
      `http://localhost:3001/stats/daily?playerId=${playerId}&game=${dailyGame}&days=${days}`
    )
      .then((r) => r.json())
      .then((rows) => {
        const formatted = (rows || []).map((x) => ({
          day: String(x.day).slice(5, 10), // "2026-02-17" -> "02-17"
          sessions: n(x.sessions),
          avgScore: Number(n(x.avgScore).toFixed(2)),
        }));
        setDaily(formatted);
      })
      .catch(console.log);
  }, [playerId, dailyGame, days]);

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
          </div>

          <div className="db-menu">
            <div className="db-menu-title">Übungen</div>

            <Link to="/math" className="db-menu-btn">
              Mathe <span>→</span>
            </Link>

            {/* si pas encore de routes, mets to="#" */}
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
          <section className="db-panel db-grow">
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
                <div className="db-block-head db-block-headRow">
                  <div>
                    <div className="db-block-title">Verlauf</div>
                    <div className="db-block-sub">Letzte {days} Tage</div>
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

                    <select
                      className="db-select"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                    >
                      <option value={7}>7</option>
                      <option value={14}>14</option>
                      <option value={30}>30</option>
                    </select>
                  </div>
                </div>

                <div className="db-chart">
                  {daily.length === 0 ? (
                    <div className="db-loading">Noch keine Daten…</div>
                  ) : (
                    <div className="db-chartInner">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={daily}
                          margin={{ top: 10, right: 25, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.18)"
                            strokeDasharray="4 6"
                          />

                          <XAxis
                            dataKey="day"
                            stroke="rgba(255,255,255,0.92)"
                            tick={{
                              fill: "rgba(255,255,255,0.95)",
                              fontSize: 12,
                            }}
                            tickMargin={10}
                          />

                          {/* Score (links) */}
                          <YAxis
                            yAxisId="left"
                            stroke="rgba(255,255,255,0.92)"
                            tick={{
                              fill: "rgba(255,255,255,0.95)",
                              fontSize: 12,
                            }}
                            domain={[0, "dataMax + 2"]}
                            width={36}
                          />

                          {/* Sessions (rechts) */}
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="rgba(255,255,255,0.92)"
                            tick={{
                              fill: "rgba(255,255,255,0.95)",
                              fontSize: 12,
                            }}
                            allowDecimals={false}
                            domain={[0, "dataMax + 1"]}
                            width={36}
                          />

                          <Tooltip
                            contentStyle={{
                              background: "rgba(15,10,35,0.94)",
                              border: "1px solid rgba(255,255,255,0.18)",
                              borderRadius: 12,
                              color: "white",
                            }}
                            labelStyle={{
                              color: "rgba(255,255,255,0.95)",
                            }}
                          />

                          <Legend
                            wrapperStyle={{
                              color: "rgba(255,255,255,0.95)",
                              paddingTop: 8,
                            }}
                          />

                          {/* Ø Score (cyan) */}
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="avgScore"
                            name="Ø Score"
                            stroke="#20E3FF"
                            strokeWidth={4}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 7 }}
                          />

                          {/* Sitzungen (pink) */}
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="sessions"
                            name="Sitzungen"
                            stroke="#FF6B9A"
                            strokeWidth={4}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 7 }}
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