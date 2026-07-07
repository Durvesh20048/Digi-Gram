// import { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   getDocs,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import AdminLayout from "../../layouts/AdminLayout";
// import { useAuth } from "../../context/AuthContext";

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const nav = useNavigate();

//   const [stats, setStats] = useState({
//     complaints: 0,
//     certificates: 0,
//     citizens: 0,
//     revenue: 0,
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const complaintsSnap = await getDocs(collection(db, "complaints"));
//         const certificatesSnap = await getDocs(collection(db, "certificates"));
//         const usersSnap = await getDocs(collection(db, "users"));

//         setStats({
//           complaints: complaintsSnap.size,
//           certificates: certificatesSnap.size,
//           citizens: usersSnap.size,
//           revenue: certificatesSnap.size * 50, // Example: certificate charge ₹50
//         });
//       } catch (err) {
//         console.error("Error loading stats:", err);
//       }
//     };

//     loadStats();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="text-gray-500">Logged in as: {user?.email}</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//         <Card title="Complaints" value={stats.complaints} />
//         <Card title="Certificates" value={stats.certificates} />   {/* ✅ NOW REAL */}
//         <Card title="Citizens" value={stats.citizens} />
//         <Card title="Revenue" value={`₹ ${stats.revenue}`} />
//       </div>

//       <div
//         onClick={() => nav("/admin/complaints")}
//         className="mt-10 bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
//       >
//         <h2 className="text-xl font-semibold">📌 View Complaints</h2>
//         <p className="text-gray-500 mt-1">Click to manage all complaints</p>
//       </div>
//     </AdminLayout>
//   );
// }

// function Card({ title, value }) {
//   return (
//     <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
//       <p className="text-gray-500">{title}</p>
//       <h3 className="text-3xl font-bold text-primary mt-2">{value}</h3>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { HiMenuAlt2 } from "react-icons/hi";

export default function AdminDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [stats, setStats] = useState({
    complaints: 0,
    certificates: 0,
    citizens: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const complaintsSnap = await getDocs(collection(db, "complaints"));
        const certificatesSnap = await getDocs(collection(db, "certificates"));
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          complaints: complaintsSnap.size,
          certificates: certificatesSnap.size,
          citizens: usersSnap.size,
          revenue: certificatesSnap.size * 50,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      {/* HEADER + MENU ICON UNDER MAIN TITLE */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Logged in as: {user?.email}</p>
        </div>

        {/* MENU ICON BELOW HEADER (LEFT SIDE) */}
        <button
          className="md:hidden mt-3 bg-primary text-white px-3 py-2 rounded-lg shadow"
          onClick={() => window.dispatchEvent(new Event("toggleSidebar"))}
        >
          <HiMenuAlt2 size={22} />
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Complaints" value={stats.complaints} />
        <Card title="Certificates" value={stats.certificates} />
        <Card title="Citizens" value={stats.citizens} />
        <Card title="Revenue" value={`₹ ${stats.revenue}`} />
      </div>

      {/* VIEW COMPLAINTS */}
      <div
        onClick={() => nav("/admin/complaints")}
        className="mt-10 bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
      >
        <h2 className="text-xl font-semibold">📌 View Complaints</h2>
        <p className="text-gray-500 mt-1">Click to manage all complaints</p>
      </div>
    </AdminLayout>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-primary mt-2">{value}</h3>
    </div>
  );
}