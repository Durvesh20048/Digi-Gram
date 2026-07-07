import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CitizenLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">

      {/* Side Menu */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 h-full w-72 md:w-64 bg-white shadow-lg border-r
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-primary">Citizen Portal</h2>
        </div>
<nav className="p-4 space-y-2">
  <MenuItem to="/dashboard" label="Dashboard" />
  <MenuItem to="/dashboard/profile" label="My Profile" />

  <MenuItem to="/dashboard/complaints" label="My Complaints" />

  {/* ✅ FIXED ROUTE HERE */}
  <MenuItem to="/dashboard/complaints/new" label="Add Complaint" />

  <MenuItem to="/dashboard/certificates/apply" label="Apply Certificate" />
  <MenuItem to="/dashboard/certificates" label="My Certificates" />
  <MenuItem to="/dashboard/certificates/status" label="Certificate Status" />

  <MenuItem to="/dashboard/schemes" label="Gov Schemes" />
  <MenuItem to="/dashboard/schemes/status" label="Scheme Status" />
</nav>



        <div className="p-4 mt-auto">
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Page */}
      <div className="flex-1">

        {/* Mobile header */}
        <div className="sticky top-[64px] bg-white/90 backdrop-blur border-b px-4 py-3 flex md:hidden">
          <button className="btn-ghost" onClick={() => setOpen(true)}>☰</button>
          <span className="ml-auto text-gray-500">
            {user?.phoneNumber || "Citizen"}
          </span>
        </div>

        <main className="container py-6">
          <h1 className="text-2xl font-bold text-ink mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuItem({ to, label }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
    >
      {label}
    </Link>
  );
}
