import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import AdminLayout from "../../layouts/AdminLayout";

function Row({ children }) { return <div className="grid md:grid-cols-5 gap-3 items-end">{children}</div>; }
function Field({ label, ...props }) {
  return (
    <label className="text-sm">
      <span className="block mb-1 text-sub">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}

export default function AdminSiteContent() {
  // lists
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [members, setMembers] = useState([]);

  // forms
  const [n, setN] = useState({ title: "", description: "", type: "news", link: "" });
  const [s, setS] = useState({ imageUrl: "" });
  const [g, setG] = useState({ imageUrl: "", title: "" });
  const [m, setM] = useState({ name: "", position: "", photo: "", phone: "" });

  useEffect(() => {
    const un1 = onSnapshot(query(collection(db, "site_news"), orderBy("postedAt", "desc")), s => {
      setNews(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const un2 = onSnapshot(collection(db, "site_slides"), s => setSlides(s.docs.map(d => ({id:d.id,...d.data()}))));
    const un3 = onSnapshot(collection(db, "site_gallery"), s => setGallery(s.docs.map(d => ({id:d.id,...d.data()}))));
    const un4 = onSnapshot(collection(db, "site_members"), s => setMembers(s.docs.map(d => ({id:d.id,...d.data()}))));
    return () => { un1(); un2(); un3(); un4(); };
  }, []);

  // add handlers
  const addNews = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "site_news"), {
      ...n,
      postedAt: new Date()
    });
    setN({ title: "", description: "", type: "news", link: "" });
  };

  const addSlide = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "site_slides"), s);
    setS({ imageUrl: "" });
  };

  const addGallery = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "site_gallery"), { ...g, uploadedAt: new Date() });
    setG({ imageUrl: "", title: "" });
  };

  const addMember = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "site_members"), m);
    setM({ name: "", position: "", photo: "", phone: "" });
  };

  const del = (col, id) => deleteDoc(doc(db, col, id));

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Site Content</h1>

      {/* NEWS */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-semibold mb-3">News / Alerts</h2>
        <form onSubmit={addNews} className="space-y-3">
          <Row>
            <Field label="Title" value={n.title} onChange={e=>setN({...n,title:e.target.value})} />
            <Field label="Type (news/alert)" value={n.type} onChange={e=>setN({...n,type:e.target.value})} />
            <Field label="Description" value={n.description} onChange={e=>setN({...n,description:e.target.value})} />
            <Field label="Link (optional)" value={n.link} onChange={e=>setN({...n,link:e.target.value})} />
            <button className="btn-primary">Add</button>
          </Row>
        </form>
        <ul className="mt-4 divide-y">
          {news.map(x=>(
            <li key={x.id} className="py-2 flex items-center gap-2">
              <span className="font-medium">{x.title}</span>
              <span className="text-xs chip">{x.type}</span>
              <span className="text-xs text-sub">{x.description}</span>
              <button onClick={()=>del("site_news", x.id)} className="ml-auto text-red-600 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* SLIDES */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-semibold mb-3">Homepage Slides</h2>
        <form onSubmit={addSlide} className="space-y-3">
          <Row>
            <Field label="Image URL" value={s.imageUrl} onChange={e=>setS({imageUrl:e.target.value})} />
            <div />
            <div />
            <div />
            <button className="btn-primary">Add</button>
          </Row>
        </form>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {slides.map(x=>(
            <div key={x.id} className="border rounded-xl overflow-hidden">
              <img src={x.imageUrl} className="w-full h-28 object-cover" />
              <button onClick={()=>del("site_slides", x.id)} className="block w-full text-center text-red-600 py-2 hover:bg-red-50">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-semibold mb-3">Photo Gallery</h2>
        <form onSubmit={addGallery} className="space-y-3">
          <Row>
            <Field label="Image URL" value={g.imageUrl} onChange={e=>setG({...g,imageUrl:e.target.value})} />
            <Field label="Title (optional)" value={g.title} onChange={e=>setG({...g,title:e.target.value})} />
            <div />
            <div />
            <button className="btn-primary">Add</button>
          </Row>
        </form>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {gallery.map(x=>(
            <div key={x.id} className="border rounded-xl overflow-hidden">
              <img src={x.imageUrl} className="w-full h-28 object-cover" />
              <div className="px-3 py-2 text-sm">{x.title}</div>
              <button onClick={()=>del("site_gallery", x.id)} className="block w-full text-center text-red-600 py-2 hover:bg-red-50">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* MEMBERS */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-semibold mb-3">Panchayat Members</h2>
        <form onSubmit={addMember} className="space-y-3">
          <Row>
            <Field label="Name" value={m.name} onChange={e=>setM({...m,name:e.target.value})} />
            <Field label="Position (Sarpanch, Upa-Sarpanch…)" value={m.position} onChange={e=>setM({...m,position:e.target.value})} />
            <Field label="Photo URL" value={m.photo} onChange={e=>setM({...m,photo:e.target.value})} />
            <Field label="Phone" value={m.phone} onChange={e=>setM({...m,phone:e.target.value})} />
            <button className="btn-primary">Add</button>
          </Row>
        </form>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {members.map(x=>(
            <div key={x.id} className="rounded-xl border p-4 text-center">
              <img src={x.photo || "https://i.imgur.com/8Km9tLL.png"} className="h-20 w-20 rounded-full object-cover mx-auto mb-2" />
              <div className="font-medium">{x.name}</div>
              <div className="text-xs text-sub">{x.position}</div>
              {x.phone && <div className="text-xs mt-1">📞 {x.phone}</div>}
              <button onClick={()=>del("site_members", x.id)} className="mt-2 text-red-600 text-sm hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
