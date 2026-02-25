import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";


import Math from "./games/math/MathGame";
import Vocab from "./games/vocab/VocabGame";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />


    <Route path="/math" element={<Math/>}/>
    <Route path= "/vocab" element={<Vocab/>}/>



    </Routes>
  );
}