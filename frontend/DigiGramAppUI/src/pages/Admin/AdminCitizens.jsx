// src/pages/Admin/AdminCitizens.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminCitizens() {
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setCitizens(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Registered Citizens</h1>

      {!citizens.length ? (
        <p className="text-gray-500 text-center">No citizens registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Village</th>
                <th className="p-3 text-left">Registered</th>
              </tr>
            </thead>

            <tbody>
              {citizens.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.name || "-"}</td>
                  <td className="p-3">{c.phone || "-"}</td>
                  <td className="p-3">{c.village || "-"}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {c.createdAt
                      ? new Date(c.createdAt.seconds * 1000).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
