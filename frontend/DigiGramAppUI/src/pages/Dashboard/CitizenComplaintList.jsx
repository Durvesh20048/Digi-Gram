// // src/pages/Dashboard/CitizenComplaintList.jsx
// import { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { useAuth } from "../../context/AuthContext";
// import CitizenLayout from "../../layouts/CitizenLayout";


// export default function CitizenComplaintList() {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const q = query(
//         collection(db, "complaints"),
//         where("userId", "==", user?.phoneNumber || "unknown"),
//         orderBy("createdAt", "desc")
//       );
//       const snap = await getDocs(q);
//       const data = [];
//       snap.forEach(d => data.push({ id: d.id, ...d.data() }));
//       setComplaints(data);
//     };
//     if (user) load();
//   }, [user]);

//   return (
//      <CitizenLayout title="Register Complaint">
//     <main className="container py-10 animate-fade">
//       <h1 className="text-3xl font-bold mb-6">My Complaints</h1>
//       {!complaints.length && <p className="text-gray-500">No complaints yet.</p>}
//       <div className="grid gap-4">
//         {complaints.map(c => (
//           <div key={c.id} className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
//             <div className="flex justify-between">
//               <h2 className="text-lg font-semibold">{c.title}</h2>
//               <span className={`px-2 py-1 rounded text-sm ${c.status==="Resolved" ? "bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{c.status}</span>
//             </div>
//             <p className="text-gray-600">{c.details}</p>
//             {c.lat && c.lon && (
//               <a className="text-blue-600 text-sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${c.lat},${c.lon}`}>View on map</a>
//             )}
//           </div>
//         ))}
//       </div>
//     </main>
//     </CitizenLayout>
//   );
// }
// src/pages/Dashboard/CitizenComplaintList.jsx
// src/pages/Dashboard/CitizenComplaint.jsx
// src/pages/Dashboard/CitizenComplaintList.jsx

//2
// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
// import { useAuth } from "../../context/AuthContext";
// import CitizenLayout from "../../layouts/CitizenLayout";
// import { Link } from "react-router-dom";

// export default function CitizenComplaintList() {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(()=> {
//     if (!user) return;
//     (async ()=> {
//       try {
//         const q = query(collection(db, "complaints"), where("userId", "==", user.uid), orderBy("createdAt","desc"));
//         const snap = await getDocs(q);
//         const list = [];
//         snap.forEach(d=>list.push({ id: d.id, ...d.data() }));
//         setComplaints(list);
//       } catch(e) { console.error(e); }
//       setLoading(false);
//     })();
//   }, [user]);

//   return (
//     <CitizenLayout title="My Complaints">
//       <main className="container mx-auto p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">My Complaints</h2>
//           <Link to="/dashboard/complaints/new" className="btn-accent">+ New</Link>
//         </div>

//         {loading && <div>Loading...</div>}
//         {!loading && complaints.length === 0 && <div className="bg-white p-6 rounded shadow">No complaints found.</div>}

//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
//           {complaints.map(c => (
//             <article key={c.id} className="bg-white p-4 rounded-md shadow hover:shadow-lg transition">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium">{c.title}</h3>
//                   <div className="text-sm text-gray-500">{c.category}</div>
//                 </div>
//                 <div>
//                   <span className={`px-2 py-1 text-sm rounded ${c.status==="Completed"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{c.status}</span>
//                 </div>
//               </div>

//               <p className="text-gray-700 mt-3 line-clamp-3">{c.description}</p>

//               <div className="flex justify-between items-center mt-4">
//                 <div className="text-xs text-gray-500">{c.createdAt?.seconds ? new Date(c.createdAt.seconds*1000).toLocaleString() : ""}</div>
//                 <div className="flex gap-3 items-center">
//                   <Link to={`/dashboard/complaints/view/${c.id}`} className="text-sm text-blue-600 underline">View</Link>
//                   {c.lat && c.lng && <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}>Map</a>}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </main>
//     </CitizenLayout>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";   // ✅ THIS LINE IS MANDATORY
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";
import { Link } from "react-router-dom";

export default function CitizenComplaintList() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadComplaints = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/complaints/user/${user.uid}`
        );
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to load complaints", err);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [user]);

  return (
    <CitizenLayout title="My Complaints">
      <main className="container mx-auto p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">My Complaints</h2>
          <Link to="/dashboard/complaints/new" className="btn-accent">
            + New Complaint
          </Link>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && complaints.length === 0 && (
          <p>No complaints registered yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{c.title}</h3>
                <span className="text-sm px-2 py-1 bg-yellow-100 rounded">
                  {c.status}
                </span>
              </div>

              <p className="text-gray-600 mt-2">{c.description}</p>

              <div className="mt-3 flex justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(c.timestamp).toLocaleString()}
                </span>
                <Link
                  className="text-blue-600 text-sm"
                  to={`/dashboard/complaints/view/${c.id}`}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </CitizenLayout>
  );
}
