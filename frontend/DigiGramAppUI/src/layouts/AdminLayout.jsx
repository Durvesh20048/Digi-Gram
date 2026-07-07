import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { HiMenuAlt2, HiLogout } from "react-icons/hi";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const menu = [
    { title: "Dashboard", path: "/dashboard/admin" },
    { title: "Site Content", path: "/admin/site" }, // <— new
    {title:"Manage Notices",path:"/admin/notices"},
    { title: "Complaints", path: "/admin/complaints" },
    { title: "Certificates", path: "/admin/certificates" },
    { title: "Citizens", path: "/admin/citizens" },
    { title: "Taxes", path: "/admin/tax" },
    { title: "Add Schemes", path: "/admin/schemes/add" },
{ title: "Scheme Applications", path: "/admin/schemes/applications" },


    
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ✅ Sidebar */}
      <aside
        className={`bg-white shadow-xl fixed md:static h-full w-64 p-6 z-20 transition-all duration-300 
        ${open ? "left-0" : "-left-64"} md:left-0`}
      >
        <h2 className="text-2xl font-bold text-primary mb-6">Admin Panel</h2>

        <nav className="space-y-1">
          {menu.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition
                ${isActive ? "bg-primary text-white shadow" : "hover:bg-gray-100"}`
              }
            >
              {m.title}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 bg-red-500 text-white w-full p-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* ✅ Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-primary text-white px-3 py-2 rounded-xl shadow-md z-30"
        onClick={() => setOpen(!open)}
      >
        <HiMenuAlt2 size={22} />
      </button>

      {/* ✅ Main content */}
      <main className="flex-1 p-8 md:ml-64 transition-all">
        {children}
      </main>
    </div>
  );
}
