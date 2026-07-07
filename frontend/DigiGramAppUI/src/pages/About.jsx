import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FaUserTie, FaUserFriends } from "react-icons/fa";

const iconForRole = (role) => {
  if (!role) return <FaUserFriends className="text-gray-400" />;
  if (role.toLowerCase().includes("sarpanch"))
    return <FaUserTie className="text-primary" />;
  return <FaUserFriends className="text-green-600" />;
};

export default function AboutPanchayat() {
  const [village, setVillage] = useState(null);
  const [members, setMembers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "villageInfo"), (snap) => {
      if (snap.docs.length) setVillage({ id: snap.docs[0].id, ...snap.docs[0].data() });
    });

    const unsub2 = onSnapshot(collection(db, "site_members"), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub3 = onSnapshot(collection(db, "site_gallery"), (snap) => {
      setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub4 = onSnapshot(
      query(collection(db, "site_news"), orderBy("postedAt", "desc")),
      (snap) => setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, []);

  return (
    <main className="container py-12 space-y-14">

      {/* ===== HEADER ===== */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-ink">About Gram Panchayat</h1>
        <p className="text-sub mt-2">Kasbe Digraj, Taluka Miraj, District Sangli</p>
      </header>

      {/* ===== PANCHAYAT PROFILE ===== */}
      {village && (
        <section className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">{village.name}</h2>

          <p className="text-sub leading-relaxed">
            {village.description || `
              Kasbe Digraj Gram Panchayat is a rural local government body responsible
              for civic administration and development of the village. It manages
              essential services such as water supply, sanitation, infrastructure,
              certificate issuance, grievance redressal and welfare scheme execution.
            `}
          </p>

          <div className="mt-6 grid md:grid-cols-4 gap-5 text-sm">
            <div className="card p-4"><b>Sarpanch:</b> {village.sarpanch}</div>
            <div className="card p-4"><b>Population:</b> {village.population}</div>
            <div className="card p-4"><b>Contact:</b> {village.contact}</div>
            <div className="card p-4"><b>Est.:</b> 1956</div>
          </div>
        </section>
      )}

      {/* ===== MEMBERS SECTION ===== */}
      <section className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Panchayat Members</h2>

        {!members.length ? (
          <p className="text-sub">No members available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {members.map(m => (
              <div key={m.id} className="bg-white border shadow-md rounded-xl p-4 text-center hover:shadow-xl transition">

                <img
                  src={m.photo || "https://i.imgur.com/8Km9tLL.png"}
                  className="h-28 w-28 rounded-full object-cover mx-auto mb-3"
                  alt={m.name}
                />

                <p className="font-semibold flex justify-center items-center gap-2">
                  {iconForRole(m.position)} {m.name}
                </p>

                <p className="text-sm text-gray-500">{m.position}</p>
                {m.phone && <p className="text-xs mt-1">📞 {m.phone}</p>}

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== GALLERY ===== */}
      <section className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Village Gallery</h2>

        {!gallery.length ? (
          <p className="text-sub">No photos added.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {gallery.map(g => (
              <figure key={g.id} className="rounded-xl overflow-hidden shadow">
                <img src={g.imageUrl} className="h-40 w-full object-cover" />
                {g.title && <figcaption className="p-2 text-sm">{g.title}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* ===== NEWS & ALERTS ===== */}
      <section className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Latest Announcements</h2>

        {!news.length ? (
          <p className="text-sub">No active announcements.</p>
        ) : (
          <div className="space-y-4">
            {news.map(n => (
              <div key={n.id} className="border p-4 rounded-lg bg-yellow-50">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-600">{n.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
