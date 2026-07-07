import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import CitizenLayout from "../../layouts/CitizenLayout";

export default function CitizenDashboard() {
  const { user } = useAuth();

  return (
    <CitizenLayout title="Citizen Dashboard">
      <p className="text-gray-600 mb-4">
        Welcome, {user?.phoneNumber || "Citizen"}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <DashCard to="/dashboard/profile" label="Profile" />

        {/* ✅ FIXED LINK */}
        <DashCard to="/dashboard/complaints/new" label="Register Complaint" />

        <DashCard to="/dashboard/complaints" label="My Complaints" />

        <DashCard to="/dashboard/certificates/apply" label="Apply for Certificates" />
        <DashCard to="/dashboard/certificates/status" label="Certificate Status" />
        <DashCard to="/dashboard/certificates" label="My Certificates" />

        <DashCard to="/dashboard/tax" label="Pay Tax" />
        <DashCard to="/dashboard/schemes" label="Schemes" />

      </div>
    </CitizenLayout>
  );
}

function DashCard({ to, label }) {
  return (
    <Link
      to={to}
      className="p-6 bg-white shadow rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all block"
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-gray-500 text-sm">Tap to open</p>
    </Link>
  );
}
