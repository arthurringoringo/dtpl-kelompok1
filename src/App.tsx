import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import LandingPage from "./pages/landing-page/landing-page";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import AccountLayout from "./pages/account/account-layout";
import ProfileInfo from "./pages/account/profile-info";
import ChangeEmail from "./pages/account/change-email";
import ChangePassword from "./pages/account/change-password";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pages WITH navbar+footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<ProfileInfo />} />
            <Route path="email" element={<ChangeEmail />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}