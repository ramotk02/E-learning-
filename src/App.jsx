import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage/Landing";
import MathGame from "./games/math/MathGame";
import Dashboard from "./pages/Dashboard/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/math" element={<MathGame />} />
      </Routes>
    </BrowserRouter>
  );
}