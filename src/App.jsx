import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MathGame from "./games/math/MathGame";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, display: "flex", gap: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Math</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MathGame />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
