import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminCertificateList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "certificates"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "certificates", id), { status });
  };

  return (
    <AdminLayout title="Certificate Approvals">
      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Citizen UID</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{item.uid}</td>
              <td className="p-3 font-medium">{item.type}</td>
              <td className="p-3">{item.status}</td>

              <td className="p-3">
                {item.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(item.id, "Approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {item.status === "Approved" && (
                  <span className="text-green-700 font-semibold">Approved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
