import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function getPlayerId() {
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

function getDisplayName() {
  // später: kommt aus Login/DB
  return localStorage.getItem("display_name") || "Gast";
}

function n(v, fallback = 0) {
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

function pct(v) {
  return `${Math.round(n(v, 0) * 100)}%`;
}

function Card({ title, value, sub }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        minWidth: 190,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.65 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
        {value}
      </div>
      {sub ? (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>{sub}</div>
      ) : null}
    </div>
  );
}

function GameTile({ title, desc, to }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 22,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          transition: "transform 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
      >
        <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
        <div style={{ marginTop: 8, opacity: 0.7 }}>{desc}</div>
        <div style={{ marginTop: 14, fontWeight: 700, opacity: 0.85 }}>
          Start →
        </div>
      </div>
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
    // Default values, falls ein Spiel noch keine Daten hat
    const base = {
      math: { game: "math", sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      vocab: { game: "vocab", sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
      conjugation: { game: "conjugation", sessions: 0, avgScore: 0, bestScore: 0, avgAccuracy: 0 },
    };
    for (const row of byGame || []) {
      base[row.game] = row;
    }
    return base;
  }, [byGame]);

  const pageStyle = {
    minHeight: "100vh",
    padding: 32,
    background: "linear-gradient(135deg,#f5f7ff,#eef1ff)",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Willkommen</div>
          <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.5 }}>
            {displayName}
          </h1>
          <div style={{ marginTop: 6, opacity: 0.65 }}>
            Edu-Exos • Dein Lern-Dashboard
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Player-ID</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{playerId}</div>
          {/* später: Login-Button / Profil */}
        </div>
      </div>

      {/* Overall Stats */}
      {!overall ? (
        <div style={{ marginTop: 20 }}>Lädt Statistiken…</div>
      ) : (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16 }}>
          <Card title="Gesamt-Sitzungen" value={n(overall.sessions)} />
          <Card title="Ø Score" value={n(overall.avgScore).toFixed(2)} />
          <Card title="Bester Score" value={n(overall.bestScore)} />
          <Card title="Ø Genauigkeit" value={pct(overall.avgAccuracy)} />
          <Card title="Ø Dauer" value={`${Math.round(n(overall.avgDuration))}s`} />
        </div>
      )}

      {/* Per Game Stats */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 10 }}>
          Statistiken pro Spiel
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 22, padding: 18, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Mathe</div>
            <div style={{ marginTop: 10, opacity: 0.8 }}>Sitzungen: {n(gameMap.math.sessions)}</div>
            <div style={{ opacity: 0.8 }}>Ø Score: {n(gameMap.math.avgScore).toFixed(2)}</div>
            <div style={{ opacity: 0.8 }}>Bester: {n(gameMap.math.bestScore)}</div>
            <div style={{ opacity: 0.8 }}>Genauigkeit: {pct(gameMap.math.avgAccuracy)}</div>
          </div>

          <div style={{ background: "white", borderRadius: 22, padding: 18, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Vokabeln</div>
            <div style={{ marginTop: 10, opacity: 0.8 }}>Sitzungen: {n(gameMap.vocab.sessions)}</div>
            <div style={{ opacity: 0.8 }}>Ø Score: {n(gameMap.vocab.avgScore).toFixed(2)}</div>
            <div style={{ opacity: 0.8 }}>Bester: {n(gameMap.vocab.bestScore)}</div>
            <div style={{ opacity: 0.8 }}>Genauigkeit: {pct(gameMap.vocab.avgAccuracy)}</div>
          </div>

          <div style={{ background: "white", borderRadius: 22, padding: 18, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Konjugation</div>
            <div style={{ marginTop: 10, opacity: 0.8 }}>Sitzungen: {n(gameMap.conjugation.sessions)}</div>
            <div style={{ opacity: 0.8 }}>Ø Score: {n(gameMap.conjugation.avgScore).toFixed(2)}</div>
            <div style={{ opacity: 0.8 }}>Bester: {n(gameMap.conjugation.bestScore)}</div>
            <div style={{ opacity: 0.8 }}>Genauigkeit: {pct(gameMap.conjugation.avgAccuracy)}</div>
          </div>
        </div>
      </div>

      {/* 3 Tiles: Spiele starten */}
      <div style={{ marginTop: 26 }}>
        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 10 }}>
          Übungen starten
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <GameTile
            title="Mathe-Übungen"
            desc="Rechnen, Level-System, Timer – trainiere täglich."
            to="/math"
          />
          <GameTile
            title="Vokabel-Übungen"
            desc="Kommt bald: Lernen mit Wiederholung & Punkte."
            to="/vocab"
          />
          <GameTile
            title="Konjugation"
            desc="Kommt bald: Verben & Zeiten üben."
            to="/conjugation"
          />
        </div>
      </div>
    </div>
  );
}