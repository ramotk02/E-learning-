import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  return `${Math.round(n(v, 0) * 100)}%`;
}

function Stat({ label, value }) {
  return (
    <div className="db-stat">
      <div className="db-stat-label">{label}</div>
      <div className="db-stat-value">{value}</div>
    </div>
  );
}

function GameBox({ title, row }) {
  return (
    <div className="db-game">
      <div className="db-game-title">{title}</div>
      <div className="db-game-grid">
        <div className="db-mini">
          <span>Sitzungen</span>
          <b>{n(row.sessions)}</b>
        </div>
        <div className="db-mini">
          <span>Ø Score</span>
          <b>{n(row.avgScore).toFixed(2)}</b>
        </div>
        <div className="db-mini">
          <span>Best</span>
          <b>{n(row.bestScore)}</b>
        </div>
        <div className="db-mini">
          <span>Genauigkeit</span>
          <b>{pct(row.avgAccuracy)}</b>
        </div>
      </div>
    </div>
  );
}

function Tile({ title, desc, to }) {
  return (
    <Link className="db-tile" to={to}>
      <div className="db-tile-title">{title}</div>
      <div className="db-tile-desc">{desc}</div>
      <div className="db-tile-cta">Start →</div>
    </Link>
  );
}

export default function Dashboard() {
  const playerId = useMemo(() => getPlayerId(), []);
  const displayName = useMemo(() => getDisplayName(), []);

  const [overall, setOverall] = useState(null);
  const [byGame, setByGame] = useState([]);

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

  const gameMap = useMemo(() => {
    const base = {
      math: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      vocab: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      conjugation: { sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
    };
    for (const row of byGame || []) {
      if (row?.game && base[row.game]) base[row.game] = row;
    }
    return base;
  }, [byGame]);

  return (
    <div className="db-page">
      <header className="db-topbar">
        <div>
          <div className="db-small">Willkommen</div>
          <div className="db-title">{displayName}</div>
          <div className="db-small">Edu-Exos • Dein Lern-Dashboard</div>
        </div>

        <div className="db-id">
          <div className="db-small">Player-ID</div>
          <div className="db-id-value">{playerId}</div>
        </div>
      </header>

      <div className="db-layout">
        {/* LEFT */}
        <aside className="db-left">
          <div className="db-panel">
            <div className="db-panel-title">Deine Übersicht</div>

            {!overall ? (
              <div className="db-loading">Lädt…</div>
            ) : (
              <div className="db-stats">
                <Stat label="Gesamt-Sitzungen" value={n(overall.sessions)} />
                <Stat label="Ø Score" value={n(overall.avgScore).toFixed(2)} />
                <Stat label="Best Score" value={n(overall.bestScore)} />
                <Stat label="Ø Genauigkeit" value={pct(overall.avgAccuracy)} />
                <Stat
                  label="Ø Dauer"
                  value={`${Math.round(n(overall.avgDuration))}s`}
                />
              </div>
            )}
          </div>

          <div className="db-panel">
            <div className="db-panel-title">Übungen starten</div>
            <div className="db-tiles">
              <Tile
                title="Mathe-Übungen"
                desc="Rechnen, Timer, Level-System."
                to="/math"
              />
              <Tile
                title="Vokabeln"
                desc="Kommt bald: Wiederholung & Punkte."
                to="/vocab"
              />
              <Tile
                title="Konjugation"
                desc="Kommt bald: Verben & Zeiten."
                to="/conjugation"
              />
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="db-right">
          <div className="db-panel">
            <div className="db-panel-title">Statistiken pro Spiel</div>

            <div className="db-games">
              <GameBox title="Mathe" row={gameMap.math} />
              <GameBox title="Vokabeln" row={gameMap.vocab} />
              <GameBox title="Konjugation" row={gameMap.conjugation} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}