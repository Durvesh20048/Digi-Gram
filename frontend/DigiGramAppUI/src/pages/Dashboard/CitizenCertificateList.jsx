import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";
import jsPDF from "jspdf";

export default function CitizenCertificateList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "certificates"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  // ✅ Citizen PDF Download
  const downloadPDF = (item) => {
    const docPDF = new jsPDF();
    docPDF.setFont("helvetica", "bold");
    docPDF.text("OFFICIAL GOVERNMENT CERTIFICATE", 40, 20);

    docPDF.setFont("helvetica", "normal");
    docPDF.text(`Certificate: ${item.type}`, 20, 50);
    docPDF.text(`Issued To: ${user.phoneNumber}`, 20, 60);
    docPDF.text(`Issued On: ${new Date().toLocaleDateString()}`, 20, 70);

    docPDF.save(`${item.type}_${item.id}.pdf`);
  };

  return (
    <CitizenLayout title="My Certificates">
      {!list.length ? (
        <p className="text-center">No certificates applied yet.</p>
      ) : (
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.type}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-xl text-sm
                      ${c.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : c.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"}`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-3 text-center">
                  {c.status === "Approved" ? (
                    <button
                      onClick={() => downloadPDF(c)}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                    >
                      Download PDF
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CitizenLayout>
  );
}
