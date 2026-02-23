import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");


    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        const r = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await r.json();
        if (!r.ok) return setErr(data?.error || "Login fehlgeschlagen");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("user_id", String(data.user.id));

        nav("/dashboard");

        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1 className="auth-title">Anmelden</h1>
                    <p className="auth-sub">Mit Username & Passwort.</p>

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
                            Login
                        </button>
                    </form>

                    <div className="auth-footer">
                        Kein Konto? <Link to="/register">Registrieren</Link>
                    </div>
                </div>
            </div>
            
        );

    }
}
