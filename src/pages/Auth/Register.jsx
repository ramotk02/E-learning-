import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const r = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await r.json();
    if (!r.ok) return setErr(data?.error || "Registrierung fehlgeschlagen");

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("user_id", String(data.user.id));

    nav("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Registrieren</h1>
        <p className="auth-sub">Erstelle dein Konto.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="auth-error">{err}</div>}

          <button className="auth-btn" type="submit">
            Konto erstellen
          </button>
        </form>

        <div className="auth-footer">
          Schon ein Konto? <Link to="/Login">Login</Link>
        </div>
      </div>
    </div>
  );
}