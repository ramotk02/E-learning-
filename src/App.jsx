import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage/Landing";
import Dashboard from "./pages/Dashboard";
import MathGame from "./games/math/MathGame";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/math" element={<MathGame />} />
      </Routes>
    </BrowserRouter>
  );
}