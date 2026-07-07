import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import CitizenLayout from "../../layouts/CitizenLayout";

export default function VillageInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "villageInfo", "main");
      const snap = await getDoc(ref);
      if (snap.exists()) setInfo(snap.data());
    };
    load();
  }, []);

  if (!info) return <CitizenLayout title="Village Information">
    <p className="text-gray-500">Loading...</p>
  </CitizenLayout>;

  return (
    <CitizenLayout title="Village Information">
      <div className="bg-white p-6 rounded-xl shadow space-y-3 max-w-2xl">
        <p><b>Village:</b> {info.village}</p>
        <p><b>Sarpanch:</b> {info.sarpanch}</p>
        <p><b>Gramsevak:</b> {info.gramsevak}</p>
        <p><b>Contact:</b> {info.contact}</p>
        <p><b>Email:</b> {info.email}</p>
        <p><b>Office Timings:</b> {info.office}</p>
        <p><b>About:</b> {info.about}</p>
      </div>
    </CitizenLayout>
  );
}
