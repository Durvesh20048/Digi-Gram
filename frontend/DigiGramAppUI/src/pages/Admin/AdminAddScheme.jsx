import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminAddScheme() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "schemes"), {
      title,
      description,
      eligibility,
      createdAt: serverTimestamp()
    });
    setSuccess("✅ Scheme Added!");
    setTitle("");
    setDescription("");
    setEligibility("");
  };

  return (
    <AdminLayout title="Add Government Scheme">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow max-w-lg space-y-4">
        {success && <p className="text-green-600">{success}</p>}

        <input className="input" placeholder="Scheme Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input className="input" placeholder="Eligibility" value={eligibility} onChange={(e) => setEligibility(e.target.value)} required />

        <button className="btn-primary w-full">Add Scheme</button>
      </form>
    </AdminLayout>
  );
}
