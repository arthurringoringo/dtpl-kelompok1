import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <NavLink
        to="/admin/dashboard"
        end
        className={({ isActive }) =>
          "adminSidebar__item" + (isActive ? " adminSidebar__item--active" : "")
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/destinasi"
        className={({ isActive }) =>
          "adminSidebar__item" + (isActive ? " adminSidebar__item--active" : "")
        }
      >
        Destinasi
      </NavLink>
    </aside>
  );
}