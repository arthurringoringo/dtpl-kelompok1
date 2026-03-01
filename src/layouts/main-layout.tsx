import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../pages/landing-page/landing-page.css"; // supaya styling nav+footer kebawa

export default function MainLayout() {
  return (
    <div className="appShell">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}