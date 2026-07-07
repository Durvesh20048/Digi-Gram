import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";

export default function CitizenSchemeStatus() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "schemeApplications"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <CitizenLayout title="Scheme Status">
      {!list.length ? (
        <p>No applications yet.</p>
      ) : (
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Scheme</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-3">{a.schemeName}</td>
                <td className="p-3">
                  <span className={
                    a.status === "Approved" ? "text-green-600 font-semibold" :
                    a.status === "Rejected" ? "text-red-600 font-semibold" :
                    "text-yellow-600 font-semibold"
                  }>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CitizenLayout>
  );
}
