import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminSchemeApplications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "schemeApplications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const update = async (id, status) => {
    await updateDoc(doc(db, "schemeApplications", id), { status });
  };

  return (
    <AdminLayout title="Scheme Applications">
      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Citizen UID</th>
            <th className="p-3">Scheme</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-3">{a.uid}</td>
              <td className="p-3">{a.schemeName}</td>
              <td className="p-3">{a.status}</td>

              <td className="p-3">
                {a.status === "Pending" && (
                  <>
                    <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={() => update(a.id, "Approved")}>
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => update(a.id, "Rejected")}>
                      Reject
                    </button>
                  </>
                )}

                {a.status === "Approved" && <span className="text-green-700 font-bold">Approved</span>}
                {a.status === "Rejected" && <span className="text-red-700 font-bold">Rejected</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
