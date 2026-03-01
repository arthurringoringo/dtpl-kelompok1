import { NavLink, Outlet } from "react-router-dom";
import "./account.css";

export default function AccountLayout() {
  return (
    <div className="accountPage">
      <aside className="accountSidebar">
        <h3>Pengaturan Akun</h3>

        <NavLink to="/account" end>Info Akun</NavLink>
        <NavLink to="/account/email">Ganti Email</NavLink>
        <NavLink to="/account/password">Kata Sandi</NavLink>
      </aside>

      <main className="accountContent">
        <Outlet />
      </main>
    </div>
  );
}