import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/landing-page/landing-page";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}