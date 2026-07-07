import { useState } from "react";
import CitizenLayout from "../../layouts/CitizenLayout";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function CitizenCertificates() {
  const { user } = useAuth();
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "certificates"), {
      uid: user.uid,
      type,
      reason,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    setSuccess("✅ Certificate request submitted!");
    setType("");
    setReason("");
  };

  return (
    <CitizenLayout title="Apply Certificate">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow max-w-xl space-y-4">
        {success && <p className="text-green-600">{success}</p>}

        <select className="input" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Certificate</option>
          <option>Birth Certificate</option>
          <option>Caste Certificate</option>
          <option>Income Certificate</option>
          <option>Residence Certificate</option>
        </select>

        <textarea
          className="input"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button className="btn-primary w-full">Apply</button>
      </form>
    </CitizenLayout>
  );
}
