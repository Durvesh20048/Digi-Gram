// src/pages/Dashboard/AdminComplaintView.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminComplaintView(){
  const { id } = useParams();
  const nav = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  useEffect(()=> {
    if (!id) return;
    (async ()=> {
      const snap = await getDoc(doc(db,"complaints",id));
      if (snap.exists()) {
        const d = snap.data(); setComplaint({ id: snap.id, ...d }); setStatus(d.status || "Pending");
      }
      setLoading(false);
    })();
  }, [id]);

  const updateStatus = async () => {
    if (!complaint) return;
    await updateDoc(doc(db,"complaints",id), { status, updatedAt: serverTimestamp(), timeline: arrayUnion({ status, note: note || `${status} by admin`, timestamp: Date.now() }) });
    alert("Updated");
    nav(-1);
  };

  if (loading) return <AdminLayout title="Complaint"><p className="p-6">Loading...</p></AdminLayout>;
  if (!complaint) return <AdminLayout title="Complaint"><p className="p-6">Not found</p></AdminLayout>;

  return (
    <AdminLayout title={`Complaint: ${complaint.title}`}>
      <main className="p-6">
        <button className="btn-ghost mb-4" onClick={()=>nav(-1)}>← Back</button>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">{complaint.title}</h2>
          <p className="text-gray-700 mt-2">{complaint.description}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Status</label>
              <select className="input mt-1" value={status} onChange={e=>setStatus(e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">Add note (optional)</label>
              <input className="input mt-1" value={note} onChange={e=>setNote(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="btn-primary" onClick={updateStatus}>Save</button>
            <button className="btn-ghost" onClick={()=>nav(-1)}>Cancel</button>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
