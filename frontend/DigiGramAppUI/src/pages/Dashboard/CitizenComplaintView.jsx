// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function CitizenComplaintView() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const [complaint, setComplaint] = useState(null);

//   // ✅ This will later load from backend using id
//   useEffect(() => {
//     // TEMP SAMPLE DATA – replace with API later
//     const dummy = {
//       id: id,
//       title: "Street Light Not Working",
//       details: "The light near the temple is broken since 5 days.",
//       status: "Pending",
//       date: "2025-01-08",
//       lat: 17.0634,
//       lon: 74.5898,
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/8/8c/Street_light.jpg",
//     };

//     setComplaint(dummy);
//   }, [id]);

//   if (!complaint)
//     return <p className="text-center py-12">Loading complaint...</p>;

//   return (
//     <main className="container py-10 max-w-3xl space-y-6">
//       <button className="btn-ghost" onClick={() => nav(-1)}>
//         ← Back
//       </button>

//       <h1 className="text-3xl font-bold text-ink">{complaint.title}</h1>

//       <div className="bg-white p-6 rounded-xl shadow space-y-4">
//         <p>
//           <strong>Status:</strong>{" "}
//           <span
//             className={
//               complaint.status === "Resolved"
//                 ? "text-green-600"
//                 : "text-yellow-600"
//             }
//           >
//             {complaint.status}
//           </span>
//         </p>

//         <p>
//           <strong>Date:</strong> {complaint.date}
//         </p>

//         <p className="text-gray-700">{complaint.details}</p>

//         {complaint.image && (
//           <img
//             src={complaint.image}
//             alt="img"
//             className="rounded-lg w-full max-h-80 object-cover"
//           />
//         )}

//         {/* ✅ Show Google Map */}
//         {complaint.lat && complaint.lon && (
//           <iframe
//             title="location-map"
//             width="100%"
//             height="300"
//             className="rounded-lg"
//             loading="lazy"
//             allowFullScreen
//             src={`https://maps.google.com/maps?q=${complaint.lat},${complaint.lon}&z=15&output=embed`}
//           ></iframe>
//         )}
//       </div>
//     </main>
//   );
// }
// src/pages/Dashboard/CitizenComplaintView.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import CitizenLayout from "../../layouts/CitizenLayout";

/**
 * Complaint detail view.
 * Loads complaint by id from Firestore.
 */

export default function CitizenComplaintView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const ref = doc(db, "complaints", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setComplaint({ id: snap.id, ...snap.data() });
        } else {
          setComplaint(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <CitizenLayout title="Complaint"><p className="p-6 text-center">Loading...</p></CitizenLayout>;
  if (!complaint) return <CitizenLayout title="Complaint"><p className="p-6 text-center">Complaint not found</p></CitizenLayout>;

  return (
    <CitizenLayout title={`Complaint: ${complaint.title || "#"}`}>
      <main className="max-w-3xl mx-auto p-6">
        <button className="btn-ghost mb-4" onClick={() => nav(-1)}>← Back</button>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">{complaint.title}</h1>
              <p className="text-sm text-gray-600">{complaint.category}{complaint.incidentDate ? " • " + new Date(complaint.incidentDate).toLocaleDateString() : ""}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded ${complaint.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{complaint.status}</span>
            </div>
          </div>

          <p className="mt-4 text-gray-700">{complaint.description}</p>

          {complaint.images && complaint.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {complaint.images.map((u, i) => <img key={i} src={u} alt={`attachment-${i}`} className="w-full h-48 object-cover rounded" />)}
            </div>
          )}

          {complaint.documentUrl && (
            <div className="mt-4">
              <a href={complaint.documentUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open attached document (PDF)</a>
            </div>
          )}

          {/* Map */}
          {complaint.lat && complaint.lng && (
            <div className="mt-4">
              <iframe
                title="map"
                width="100%"
                height="300"
                loading="lazy"
                className="rounded"
                src={`https://maps.google.com/maps?q=${complaint.lat},${complaint.lng}&z=15&output=embed`}
              />
            </div>
          )}

          {/* Timeline */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Status Timeline</h3>
            <ol className="space-y-3">
              {(complaint.timeline || []).map((t, idx) => {
                const ts = t.timestamp?.seconds ? new Date(t.timestamp.seconds * 1000).toLocaleString() : (t.timestamp || "");
                return (
                  <li key={idx} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium">{t.status}</div>
                      <div className="text-gray-500">{ts}</div>
                    </div>
                    {t.note && <div className="text-gray-700 mt-1 text-sm">{t.note}</div>}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </main>
    </CitizenLayout>
  );
}
