import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const API = "http://localhost:8080";

export default function AdminComplaintList() {

  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadComplaints();
    loadAnalytics();
  }, []);

  const loadComplaints = async () => {
    const res = await axios.get(`${API}/api/complaints/admin`);
    setComplaints(res.data);
  };

  const loadAnalytics = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/analytics");
    console.log("Analytics:", res.data);
    setAnalytics(res.data);
  } catch (err) {
    console.error("Analytics load failed", err);
  }
};

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/api/complaints/${id}/admin-status?status=${status}`);
    loadComplaints();
    loadAnalytics();
  };

  if (!analytics) return <AdminLayout>Loading...</AdminLayout>;

  const statusData = analytics ? [
  { name: "Pending", value: analytics.pending },
  { name: "In Progress", value: analytics.inProgress },
  { name: "Resolved", value: analytics.resolved }
] : [];

const priorityData = analytics && analytics.byPriority
  ? Object.entries(analytics.byPriority).map(([k, v]) => ({ name: k, value: v }))
  : [];

  const COLORS = ["#facc15", "#60a5fa", "#4ade80"];

  return (
    <AdminLayout title="🧠 Smart Complaint Dashboard">

      {/* ====== ANALYTICS PANEL ====== */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Complaints" value={analytics.totalComplaints} />
        <StatCard title="Pending" value={analytics.pending} color="bg-yellow-200" />
        <StatCard title="In Progress" value={analytics.inProgress} color="bg-blue-200" />
        <StatCard title="Resolved" value={analytics.resolved} color="bg-green-200" />
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">

        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold mb-3">Complaints By Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <Bar dataKey="value" fill="#2563eb" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold mb-3">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" label>
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ====== COMPLAINT TABLE ====== */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Citizen</th>
              <th className="p-3">Issue</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Score</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td className="p-3">{c.citizenPhone}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.priority}</td>
                <td className="p-3">{c.aiScore}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">
                  {c.status !== "Resolved" && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => updateStatus(c.id, "Resolved")}
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

function StatCard({ title, value, color = "bg-white" }) {
  return (
    <div className={`p-5 rounded shadow ${color}`}>
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
