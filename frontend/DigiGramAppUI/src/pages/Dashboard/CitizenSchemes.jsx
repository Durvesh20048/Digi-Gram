import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";

export default function CitizenSchemes() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const q = query(collection(db, "schemes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setSchemes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const apply = async (item) => {
    await addDoc(collection(db, "schemeApplications"), {
      uid: user.uid,
      schemeId: item.id,
      schemeName: item.title,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    setSuccess("✅ Application Submitted!");
    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <CitizenLayout title="Government Schemes">
      {success && <p className="text-green-600">{success}</p>}

      {!schemes.length ? (
        <p className="text-gray-500">No schemes available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {schemes.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="text-gray-600">{s.description}</p>
              <p className="text-sm text-gray-500 mt-1">Eligibility: {s.eligibility}</p>

              <button
                className="btn-primary mt-3"
                onClick={() => apply(s)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </CitizenLayout>
  );
}
