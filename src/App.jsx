import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}