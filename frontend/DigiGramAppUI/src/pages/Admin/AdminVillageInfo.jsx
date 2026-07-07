import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminVillageInfo() {
  const [info, setInfo] = useState({
    village: "",
    sarpanch: "",
    gramsevak: "",
    contact: "",
    email: "",
    office: "",
    about: "",
  });

  const [saved, setSaved] = useState("");

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "villageInfo", "main");
      const snap = await getDoc(ref);
      if (snap.exists()) setInfo(snap.data());
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "villageInfo", "main"), info, { merge: true });
    setSaved("✅ Updated!");
    setTimeout(() => setSaved(""), 2000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Village Information</h1>
      {saved && <p className="bg-green-100 text-green-700 p-2 rounded">{saved}</p>}

      <form onSubmit={save} className="bg-white p-6 rounded-xl shadow space-y-3 max-w-xl">
        <Input label="Village" val={info.village} onChange={(v)=>setInfo({...info, village:v})}/>
        <Input label="Sarpanch" val={info.sarpanch} onChange={(v)=>setInfo({...info, sarpanch:v})}/>
        <Input label="Gramsevak" val={info.gramsevak} onChange={(v)=>setInfo({...info, gramsevak:v})}/>
        <Input label="Contact" val={info.contact} onChange={(v)=>setInfo({...info, contact:v})}/>
        <Input label="Email" val={info.email} onChange={(v)=>setInfo({...info, email:v})}/>
        <Input label="Office Timings" val={info.office} onChange={(v)=>setInfo({...info, office:v})}/>
        <textarea
          className="input h-24"
          placeholder="About Village"
          value={info.about}
          onChange={(e)=>setInfo({...info, about:e.target.value})}
        />

        <button className="btn-primary w-full">Save</button>
      </form>
    </AdminLayout>
  );
}

function Input({ label, val, onChange }) {
  return (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>
      <input
        className="input"
        value={val || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
