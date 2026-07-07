import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AdminNotices() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  // ✅ Load notices from correct collection
  useEffect(() => {
    onSnapshot(collection(db, "site_notices"), (snap) => {
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const addNotice = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "site_notices"), {
      title,
      message,
      date: new Date(),
      active: true,
      priority: 1,       // optional, supports ordering
    });
    setTitle("");
    setMessage("");
  };

  const toggleNotice = async (id, active) => {
    await updateDoc(doc(db, "site_notices", id), { active: !active });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "site_notices", id));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Notices</h1>

      <form
        onSubmit={addNotice}
        className="bg-white p-5 rounded-xl shadow max-w-lg space-y-3 mb-6"
      >
        <input
          className="input"
          placeholder="Notice title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input h-24"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn-primary w-full">Add Notice</button>
      </form>

      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleNotice(n.id, n.active)}
                className={`px-3 py-1 rounded ${
                  n.active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                }`}
              >
                {n.active ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => remove(n.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
