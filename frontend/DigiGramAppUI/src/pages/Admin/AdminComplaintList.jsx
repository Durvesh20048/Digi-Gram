// import { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import AdminLayout from "../../layouts/AdminLayout";

// export default function AdminComplaintList() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setComplaints(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsubscribe();
//   }, []);

//   const updateStatus = async (id, newStatus) => {
//     await updateDoc(doc(db, "complaints", id), { status: newStatus });
//   };

//   return (
//     <AdminLayout>
//       <h1 className="text-3xl font-bold mb-6">All Complaints</h1>

//       {!complaints.length && (
//         <p className="text-center text-gray-500">No complaints found.</p>
//       )}

//       <div className="overflow-x-auto">
//         <table className="w-full bg-white rounded-xl shadow">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="p-3">Citizen</th>
//               <th className="p-3">Issue</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Location</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {complaints.map((c) => (
//               <tr key={c.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{c.userId}</td>
//                 <td className="p-3 font-medium">{c.title}</td>

//                 <td className="p-3">
//                   <span
//                     className={`px-3 py-1 rounded-xl text-sm
//                       ${c.status === "Resolved"
//                         ? "bg-green-100 text-green-700"
//                         : c.status === "In-Progress"
//                         ? "bg-blue-100 text-blue-700"
//                         : "bg-yellow-100 text-yellow-700"}`}
//                   >
//                     {c.status}
//                   </span>
//                 </td>

//                 <td className="p-3">
//                   {c.lat && c.lon ? (
//                     <a
//                       href={`https://www.google.com/maps?q=${c.lat},${c.lon}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-primary underline"
//                     >
//                       View
//                     </a>
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 <td className="p-3 space-x-2">
//                   {c.status !== "In-Progress" && c.status !== "Resolved" && (
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded"
//                       onClick={() => updateStatus(c.id, "In-Progress")}
//                     >
//                       Start
//                     </button>
//                   )}

//                   {c.status !== "Resolved" && (
//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded"
//                       onClick={() => updateStatus(c.id, "Resolved")}
//                     >
//                       Resolve
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </AdminLayout>
//   );
// }


// src/pages/Admin/AdminComplaintList.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const API = "http://localhost:8080/api/complaints";

/* ================= HEATMAP LAYER ================= */
function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = window.L.heatLayer(points, {
      radius: 30,   // slightly larger points
      blur: 20,     // smoother effect
      maxZoom: 17,
      max: 1        // max intensity
    }).addTo(map);

    return () => map.removeLayer(heat);
  }, [points, map]);

  return null;
}

/* ================= MAIN COMPONENT ================= */
export default function AdminComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    loadComplaints();
    loadAnalytics();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await axios.get(`${API}/admin`);
      setComplaints(res.data);

      // normalize AI Score for heat intensity (0-1)
      const points = res.data
        .filter(c => c.latitude && c.longitude)
        .map(c => [c.latitude, c.longitude, (c.aiScore || 50) / 100]);

      setHeatPoints(points);
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API}/${id}/admin-status?status=${newStatus}`);
      loadComplaints();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const statusData = analytics ? [
    { name: "Pending", value: analytics.pending },
    { name: "In-Progress", value: analytics.inProgress },
    { name: "Resolved", value: analytics.resolved }
  ] : [];

  const priorityData = analytics
    ? Object.entries(analytics.byPriority).map(([k, v]) => ({ name: k, value: v }))
    : [];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  return (
    <AdminLayout title="🧠 Smart Complaint Dashboard">

      {/* ===== STAT CARDS ===== */}
      {analytics && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card title="Total Complaints" value={analytics.totalComplaints} />
            <Card title="Pending" value={analytics.pending} color="bg-yellow-200" />
            <Card title="In Progress" value={analytics.inProgress} color="bg-blue-200" />
            <Card title="Resolved" value={analytics.resolved} color="bg-green-200" />
          </div>

          {/* ===== ENHANCED GRAPHS ===== */}
          <div className="grid grid-cols-2 gap-8 mb-10">

            {/* ===== BAR CHART ===== */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Complaints By Status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData}>
                  <defs>
                    <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="value"
                    fill="url(#statusGradient)"
                    radius={[10, 10, 10, 10]}
                  />
                  <Tooltip contentStyle={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ===== PIE/DONUT CHART ===== */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Priority Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}

      {/* ================= HEATMAP ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-10">
        <h2 className="text-lg font-bold mb-4">🗺 Complaint Heatmap (AI Zone Analysis)</h2>
        <MapContainer center={[20.5937, 78.9629]} zoom={6} style={{ height: "420px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <HeatLayer points={heatPoints} />
        </MapContainer>
      </div>

      {/* ================= COMPLAINT TABLE ================= */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Citizen</th>
              <th className="p-3 text-left">Issue</th>
              <th className="p-3 text-center">Priority</th>
              <th className="p-3 text-center">AI Score</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.citizenPhone}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${c.priority === "High" ? "bg-red-100 text-red-700" :
                      c.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"}`}>
                    {c.priority}
                  </span>
                </td>
                <td className="p-3 text-center font-bold">{c.aiScore}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${c.status === "Resolved" ? "bg-green-100 text-green-700" :
                      c.status === "In-Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {c.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(c.id, "In-Progress")}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Start
                    </button>
                  )}
                  {c.status === "In-Progress" && (
                    <button
                      onClick={() => updateStatus(c.id, "Resolved")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                  {c.status === "Resolved" && <span className="text-gray-400 italic">Completed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

/* ================= CARD ================= */
function Card({ title, value, color = "bg-white" }) {
  return (
    <div className={`p-5 rounded-xl shadow ${color}`}>
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}



/*=====This module uses a Rule-Based AI Priority Engine that simulates machine intelligence by 
analyzing complaint keywords, categories, and urgency patterns to assign priority scores. It is part of 
a scalable microservice architecture and acts as a foundation for future supervised ML model integration.*/