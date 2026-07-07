import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function CitizenCertificateStatus() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "certificates"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const downloadPDF = async (item) => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("GOVERNMENT OF INDIA", 60, 15);

    pdf.setFontSize(13);
    pdf.text(`Certificate Type: ${item.type}`, 20, 50);
    pdf.text(`Issued To: ${item.uid}`, 20, 60);
    pdf.text(`Issued On: ${new Date().toLocaleDateString()}`, 20, 70);

    // ✅ Add QR Code
    const qr = await QRCode.toDataURL(`CERT-${item.id}-${item.uid}`);
    pdf.addImage(qr, "PNG", 150, 50, 40, 40);

    // ✅ Add Digital Signature
    pdf.text("Digitally Signed By:", 20, 120);
    pdf.text("Gram Panchayat Registrar", 20, 128);
    pdf.text("Valid under IT Act 2000", 20, 136);

    pdf.save(`${item.type}_${item.id}.pdf`);
  };

  return (
    <CitizenLayout title="My Certificates">
      {!list.length ? (
        <p className="text-gray-500">No certificates applied yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Certificate</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Download</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{item.reason}</td>

                  <td className="p-3">
                    <span className={
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-xl"
                        : item.status === "Rejected"
                        ? "bg-red-100 text-red-700 px-3 py-1 rounded-xl"
                        : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-xl"
                    }>
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {item.status === "Approved" ? (
                      <button
                        onClick={() => downloadPDF(item)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Download
                      </button>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CitizenLayout>
  );
}
