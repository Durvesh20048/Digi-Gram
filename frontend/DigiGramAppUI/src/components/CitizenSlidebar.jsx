import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CitizenSidebar({ open, setOpen }) {
  const { logout } = useAuth();

  const Item = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg transition ${
          isActive ? "bg-primary/10 text-primary font-semibold"
                   : "text-gray-700 hover:bg-gray-100"
        }`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  );

  // Drawer container (mobile) + rail (desktop)
  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-72 md:w-64
                    bg-white border-r shadow-md md:shadow-none
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-primary">Citizen Panel</h2>
        </div>

        <nav className="p-4 space-y-2">
          <Item to="/dashboard" label="Dashboard" />
          <Item to="/dashboard/profile" label="Profile" />
          <Item to="/dashboard/complaint" label="Register Complaint" />
          <Item to="/dashboard/complaints" label="My Complaints" />
          <Item to="/dashboard/certificates" label="Certificates" />
          <Item to="/dashboard/tax" label="Pay Tax" />
          <Item to="/dashboard/schemes" label="Schemes" />
          <Item to="/dashboard/downloads" label="Downloads" />
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
