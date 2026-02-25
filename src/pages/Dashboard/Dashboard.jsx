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

function getUserId() {
  return localStorage.getItem("user_id"); 
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
  return id.slice(0, 6) + "…";
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("display_name");
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
  const userId = useMemo(() => getUserId(), []);
  const displayName = useMemo(() => getDisplayName(), []);

  const [overall, setOverall] = useState(null);
  const [byGame, setByGame] = useState([]);

  const [mathSeries, setMathSeries] = useState([]);
  const [vocabSeries, setVocabSeries] = useState([]);
  const [conjSeries, setConjSeries] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/stats/overall?playerId=${userId}`)
      .then((r) => r.json())
      .then(setOverall)
      .catch(console.log);

    fetch(`http://localhost:3001/stats/by-game?playerId=${userId}`)
      .then((r) => r.json())
      .then(setByGame)
      .catch(console.log);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(
      `http://localhost:3001/stats/sessions?playerId=${userId}&game=math&limit=60`
    )
      .then((r) => r.json())
      .then((rows) => setMathSeries(Array.isArray(rows) ? rows : []))
      .catch(console.log);

    fetch(
      `http://localhost:3001/stats/sessions?playerId=${userId}&game=vocab&limit=60`
    )
      .then((r) => r.json())
      .then((rows) => setVocabSeries(Array.isArray(rows) ? rows : []))
      .catch(console.log);

    fetch(
      `http://localhost:3001/stats/sessions?playerId=${userId}&game=conjugation&limit=60`
    )
      .then((r) => r.json())
      .then((rows) => setConjSeries(Array.isArray(rows) ? rows : []))
      .catch(console.log);
  }, [userId]);

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

  const chartData = useMemo(() => {
    const maxLen = Math.max(
      mathSeries.length,
      vocabSeries.length,
      conjSeries.length
    );

    return Array.from({ length: maxLen }, (_, i) => ({
      idx: i + 1,
      math: mathSeries?.[i]?.score ?? null,
      vocab: vocabSeries?.[i]?.score ?? null,
      conjugation: conjSeries?.[i]?.score ?? null,
    }));
  }, [mathSeries, vocabSeries, conjSeries]);

  if (!userId) {
    return (
      <div className="db-page">
        <div className="db-shell">
          <div className="db-loading">
            Nicht eingeloggt. Bitte <a href="/login">einloggen</a>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-shell">
        <aside className="db-side">
          <div className="db-profile">
            <div className="db-welcome">Willkommen</div>
            <div className="db-name">{displayName}</div>
            <div className="db-sub">Edu-Exos • Dashboard</div>

            <div className="db-idRow">
              <span className="db-idLabel">User-ID</span>
              <span className="db-idValue" title={userId}>
                {shortId(userId)}
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

        <main className="db-main">
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
                <Kpi
                  label="Ø Dauer"
                  value={`${Math.round(n(overall.avgDuration))}s`}
                />
              </div>
            )}
          </section>

          <section className="db-panel">
            <div className="db-split">
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

              <div className="db-block">
                <div className="db-block-head">
                  <div className="db-block-title">Verlauf (3 Spiele)</div>
                  <div className="db-block-sub">
                    Letzte 60 Sessions pro Spiel
                  </div>
                </div>

                <div className="db-chart">
                  {chartData.length === 0 ? (
                    <div className="db-loading">Noch keine Daten…</div>
                  ) : (
                    <div className="db-chartWrap">
                      <ResponsiveContainer width="100%" height={280} minWidth={0}>
                        <LineChart
                          data={chartData}
                          margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                        >
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.06)"
                            strokeDasharray="3 10"
                          />

                          <XAxis
                            dataKey="idx"
                            stroke="rgba(255,255,255,0.50)"
                            tick={{
                              fill: "rgba(255,255,255,0.75)",
                              fontSize: 12,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            stroke="rgba(255,255,255,0.50)"
                            tick={{
                              fill: "rgba(255,255,255,0.75)",
                              fontSize: 12,
                            }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, "dataMax + 2"]}
                            width={36}
                          />

                          <Tooltip
                            cursor={{
                              stroke: "rgba(255,255,255,0.10)",
                              strokeWidth: 1,
                            }}
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
                            dataKey="math"
                            name="Mathe"
                            stroke="#20E3FF"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                            connectNulls={false}
                          />
                          <Line
                            type="stepAfter"
                            dataKey="vocab"
                            name="Vokabeln"
                            stroke="#7CFF6B"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                            connectNulls={false}
                          />
                          <Line
                            type="stepAfter"
                            dataKey="conjugation"
                            name="Konjugation"
                            stroke="#FF6BD6"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                            connectNulls={false}
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