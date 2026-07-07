// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { FaUserFriends, FaUserShield, FaUserTie } from "react-icons/fa";
// import { AiOutlineClose } from "react-icons/ai";

// const FeatureCard = ({ icon, title, text }) => (
//   <div
//     data-aos="fade-up"
//     className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition"
//   >
//     <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-content-center mb-4">
//       {icon}
//     </div>
//     <h3 className="text-ink font-semibold mb-1">{title}</h3>
//     <p className="text-sm text-sub">{text}</p>
//   </div>
// );

// const iconForMember = (role) => {
//   if (role.toLowerCase().includes("sarpanch"))
//     return <FaUserTie className="text-primary" />;
//   if (role.toLowerCase().includes("deputy"))
//     return <FaUserShield className="text-green-600" />;
//   return <FaUserFriends className="text-gray-500" />;
// };

// export default function Home() {
//   const [slides, setSlides] = useState([]);
//   const [news, setNews] = useState([]);
//   const [village, setVillage] = useState(null);
//   const [popup, setPopup] = useState(null);
// const [notices, setNotices] = useState([]);

//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });

//     // ✅ Firestore listeners
//     onSnapshot(collection(db, "slides"), (snap) => {
//       setSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     const q = query(collection(db, "news"), orderBy("date", "desc"));
//     onSnapshot(q, (snap) => {
//       setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     onSnapshot(collection(db, "villageInfo"), (snap) => {
//       if (snap.docs.length) setVillage(snap.docs[0].data());
//     });
//     // popup news
//     const unsubNotice = onSnapshot(
//   query(collection(db, "site_notices"), orderBy("priority", "asc")),
//   (snap) => {
//     const now = new Date();
//     const active = snap.docs
//       .map((d) => ({ id: d.id, ...d.data() }))
//       .filter(
//         (n) =>
//           n.active === true &&
//           (!n.expiresAt ||
//             new Date(
//               n.expiresAt.toDate ? n.expiresAt.toDate() : n.expiresAt
//             ) > now)
//       );

//     setNotices(active);

//     if (active.length && !popup && !sessionStorage.getItem("notice_closed")) {
//       setPopup(active[0]);
//     }
//   }
// );


//     // ✅ LOCATION + WEATHER
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (pos) => {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;


//         // ✅ High accuracy reverse geocode
//         const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
//         const geoRes = await fetch(geoUrl);
//         const geo = await geoRes.json();

//         let exactPlace =
//           geo.address.village ||
//           geo.address.town ||
//           geo.address.city ||
//           geo.address.suburb ||
//           geo.address.county ||
//           geo.address.state_district ||
//           geo.address.state ||
//           "Unknown";

//        document.getElementById("locationText").innerText = exactPlace;

//         // ✅ Weather API
//         const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
//         const res = await fetch(weatherURL);
//         const data = await res.json();

//         if (data.current_weather) {
//           const temp = data.current_weather.temperature;
//           const code = data.current_weather.weathercode;

//           let condition = "Clear";
//           if ([1, 2, 3].includes(code)) condition = "Cloudy";
//           if ([45, 48].includes(code)) condition = "Fog";
//           if ([51, 53, 55, 61, 63, 65].includes(code)) condition = "Rain";
//           if ([71, 73, 75].includes(code)) condition = "Snow";

//          document.getElementById("weatherText").innerText = `${temp}°C, ${condition}`;
//         }
//       },
//         () => {
//           document.getElementById("locationText").innerText = "Location access denied";
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     }



//   }, []);



//   return (
//     <main className="overflow-hidden">

//       {/* ✅ NEWS SCROLLER */}
//       <section className="bg-yellow-100 py-2 text-center font-semibold text-ink shadow-sm">
//         Latest Updates →
//         <marquee>
//           {news.length
//             ? news.map((n) => `${n.title}: ${n.message} • `)
//             : "No announcements yet"}
//         </marquee>

//       </section>

//       {/* ✅ WEATHER + LOCATION WIDGET */}
//       <section className="bg-white shadow-sm py-2 border-b">
//         <div className="container flex flex-wrap justify-between items-center text-sm text-gray-700">
//           <div className="flex gap-2 items-center">
//             🌍 <span id="locationText">Detecting location...</span>
//           </div>

//           <div className="flex gap-2 items-center">
//             ☁️ <span id="weatherText">Fetching weather...</span>
//           </div>
//         </div>
//       </section>




//       {/* ✅ HERO */}
//       <section className="container py-20 grid md:grid-cols-2 gap-14 items-center">
//         <div data-aos="fade-right">
//           <span className="chip">Welcome</span>
//           <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-ink">
//             Welcome to DigiGram — Digital services of Kasbe-Digraj Gram Panchayat
//           </h1>
//           <p className="mt-4 text-lg text-sub">
//             Certificates, Complaints, Taxes, Schemes — all in one place.
//           </p>

//           <div className="mt-6 flex gap-3">
//             <Link to="/login" className="btn-primary">Login with Mobile (OTP)</Link>
//             <Link to="/services" className="btn-ghost">View Services</Link>
//           </div>
//         </div>

//         {/* ✅ SLIDESHOW */}
//         <div data-aos="fade-left" className="w-full">
//           <div className="bg-gradient-to-tr from-green-50 to-blue-50 p-6 md:p-8 rounded-xl shadow-xl">
//             <div className="h-48 w-full rounded-xl bg-gray-200 grid place-content-center overflow-hidden">
//               {slides.length ? (
//                 <marquee direction="left" scrollAmount="5">
//                   {slides.map((s) => (
//                     <img
//                       key={s.id}
//                       src={s.imageURL}
//                       alt="slide"
//                       className="inline-block mx-3 h-44 rounded-xl shadow-lg hover:scale-105 transition"
//                     />
//                   ))}
//                 </marquee>
//               ) : (
//                 <p className="text-gray-500">Uploading Panchayat media…</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ✅ PANCHAYAT INFO SECTION */}
//       <section className="container py-16">
//         <h2 className="text-3xl font-bold text-ink mb-8" data-aos="fade-up">
//           Kasbe Digraj Gram Panchayat
//         </h2>

//         {/* ✅ PHOTO HIGHLIGHTS */}
//         <div
//           data-aos="zoom-in"
//           className="bg-gradient-to-r from-blue-50 to-green-50 shadow-xl rounded-xl p-6 mb-10"
//         >
//           <h3 className="font-semibold text-primary mb-3">Photo Highlights</h3>

//           {slides.length ? (
//             <marquee direction="left" scrollAmount="4">
//               {slides.map((s) => (
//                 <img
//                   key={s.id}
//                   src={s.imageURL}
//                   alt="slide"
//                   className="inline-block mx-3 h-40 rounded-xl shadow-lg hover:scale-105 transition"
//                 />
//               ))}
//             </marquee>
//           ) : (
//             <p className="text-gray-500">No photos added yet.</p>
//           )}
//         </div>

//         {/* ✅ MEMBERS */}
//         {village?.members?.length > 0 && (
//           <div
//             data-aos="fade-up"
//             className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-6 mb-10"
//           >
//             <h3 className="font-semibold text-primary mb-3">Panchayat Members</h3>

//             <div className="flex gap-6 overflow-x-auto py-2">
//               {village.members.map((m, i) => (
//                 <div
//                   key={i}
//                   className="min-w-[140px] bg-white shadow rounded-lg p-4 text-center hover:shadow-lg hover:-translate-y-1 transition"
//                 >
//                   <img
//                     src={m.photo}
//                     className="h-20 w-20 rounded-full object-cover mx-auto mb-2"
//                   />
//                   <p className="font-medium flex justify-center items-center gap-1">
//                     {iconForMember(m.role)} {m.name}
//                   </p>
//                   <p className="text-xs text-gray-500">{m.role}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ✅ SHORT ABOUT */}
//         {village && (
//           <div
//             data-aos="fade-up"
//             className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 text-left"
//           >
//             <p className="text-sub">
//               <b>{village.name}</b> is a developing village under the Sangli-Miraj-Kupwad
//               region. Panchayat provides services like certificates, complaints, tax
//               collection & more.
//             </p>

//             <div className="mt-3">
//               <Link className="text-primary font-semibold hover:underline" to="/about">
//                 See full Panchayat details →
//               </Link>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* ✅ POPULAR SERVICES */}
//       <section className="container py-20">
//         <div className="flex items-end justify-between">
//           <h2 className="text-3xl font-bold">Popular Services</h2>
//           <Link to="/services" className="text-primary font-semibold hover:underline">
//             See all services →
//           </Link>
//         </div>

//         <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <FeatureCard
//             icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l7 6v12H5V8z" /></svg>}
//             title="Certificates"
//             text="Apply for birth, income, caste, residence certificates."
//           />
//           <FeatureCard
//             icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 3 8h18z" /></svg>}
//             title="Complaints"
//             text="Register civic issues and track resolution status."
//           />
//           <FeatureCard
//             icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" /></svg>}
//             title="Taxes"
//             text="View dues & pay house/water tax securely."
//           />
//           <FeatureCard
//             icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v16H4z" /></svg>}
//             title="Schemes"
//             text="Discover government schemes & check eligibility."
//           />
//         </div>
//       </section>

//       {/* ✅ ABOUT VILLAGE */}
//       {village && (
//         <section
//           data-aos="fade-up"
//           className="container py-10 bg-white/90 backdrop-blur shadow-xl rounded-xl mb-16"
//         >
//           <h2 className="text-2xl font-bold">About {village.name}</h2>
//           <p className="text-sub mt-2">{village.description}</p>

//           <div className="mt-4 space-y-1 text-sub text-left">
//             <p>📌 <b>Sarpanch:</b> {village.sarpanch}</p>
//             <p>📞 <b>Contact:</b> {village.contact}</p>
//             <p>👥 <b>Population:</b> {village.population}</p>
//           </div>
//         </section>
//       )}


//       {popup && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-xl max-w-md relative">
//             <button className="absolute top-2 right-2" onClick={() => setPopup(null)}>
//               <AiOutlineClose size={20} />
//             </button>
//             <h3 className="text-xl font-bold text-primary mb-2">{popup.title}</h3>
//             <p className="text-gray-700">{popup.message}</p>
//           </div>
//         </div>
//       )}


//     </main>
//   );
// }
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserFriends, FaUserShield, FaUserTie } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";



const FeatureCard = ({ icon, title, text }) => (
  <div
    data-aos="fade-up"
    className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition"
  >
    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-content-center mb-4">
      {icon}
    </div>
    <h3 className="text-ink font-semibold mb-1">{title}</h3>
    <p className="text-sm text-sub">{text}</p>
  </div>
);

const iconForMember = (role) => {
  if (role.toLowerCase().includes("sarpanch"))
    return <FaUserTie className="text-primary" />;
  if (role.toLowerCase().includes("deputy"))
    return <FaUserShield className="text-green-600" />;
  return <FaUserFriends className="text-gray-500" />;
};

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [news, setNews] = useState([]);
  const [village, setVillage] = useState(null);
  const [popup, setPopup] = useState(null);
  const [notices, setNotices] = useState([]);   // ✅ NOW CORRECT
  const [locationText, setLocationText] = useState("Detecting location...");
  const [weatherText, setWeatherText] = useState("Fetching weather...");
  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // ✅ Firestore listeners
   onSnapshot(collection(db, "site_slides"), (snap) => {
  setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

    const q = query(collection(db, "site_news"), orderBy("postedAt", "desc"));
onSnapshot(q, (snap) => {
  setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

    onSnapshot(collection(db, "villageInfo"), (snap) => {
      if (snap.docs.length) setVillage(snap.docs[0].data());
    });
    // popup news
    const unsubNotice = onSnapshot(
  query(collection(db, "site_notices"), orderBy("priority", "asc")),
  (snap) => {
    const now = new Date();
    const active = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (n) =>
          n.active === true &&
          (!n.expiresAt ||
            new Date(
              n.expiresAt.toDate ? n.expiresAt.toDate() : n.expiresAt
            ) > now)
      );

    setNotices(active);

    if (active.length && !popup && !sessionStorage.getItem("notice_closed")) {
      setPopup(active[0]);
    }
  }
);


    // ✅ LOCATION + WEATHER
   if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // ✅ Reverse Geocode
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
      const geoRes = await fetch(geoUrl);
      const geo = await geoRes.json();

      const exactPlace =
        geo.address?.village ||
        geo.address?.town ||
        geo.address?.city ||
        geo.address?.state ||
        "Unknown";

      setLocationText(exactPlace);

      // ✅ Weather API
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(weatherURL);
      const data = await res.json();

      if (data.current_weather) {
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        let condition = "Clear";
        if ([1, 2, 3].includes(code)) condition = "Cloudy";
        if ([45, 48].includes(code)) condition = "Fog";
        if ([51, 53, 55, 61, 63, 65].includes(code)) condition = "Rain";
        if ([71, 73, 75].includes(code)) condition = "Snow";

        setWeatherText(`${temp}°C, ${condition}`);
      }
    },
    () => {
      setLocationText("Location access denied");
      setWeatherText("Weather unavailable");
    },
    { enableHighAccuracy: true }
  );
}




  }, []);



  return (
    <main className="overflow-hidden">

      {/* ✅ NEWS SCROLLER */}
      <section className="bg-yellow-100 py-2 text-center font-semibold text-ink shadow-sm">
        Latest Updates →
        <marquee>
          {news.length
            ? news.map((n) => `${n.title}: ${n.message} • `)
            : "No announcements yet"}
        </marquee>

      </section>

      {/* ✅ WEATHER + LOCATION WIDGET */}
      <section className="bg-white shadow-sm py-2 border-b">
        <div className="container flex flex-wrap justify-between items-center text-sm text-gray-700">
          <div className="flex gap-2 items-center">
            🌍 <span>{locationText}</span>
          </div>

          <div className="flex gap-2 items-center">
            ☁️ <span>{weatherText}</span>
          </div>
        </div>
      </section>




      {/* ✅ HERO */}
      <section className="container py-20 grid md:grid-cols-2 gap-14 items-center">
        <div data-aos="fade-right">
          <span className="chip">Welcome</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-ink">
            Welcome to DigiGram — Digital services of Kasbe-Digraj Gram Panchayat
          </h1>
          <p className="mt-4 text-lg text-sub">
            Certificates, Complaints, Taxes, Schemes — all in one place.
          </p>

          <div className="mt-6 flex gap-3">
            <Link to="/login" className="btn-primary">Login with Mobile (OTP)</Link>
            <Link to="/services" className="btn-ghost">View Services</Link>
          </div>
        </div>

        {/* ✅ SLIDESHOW */}
        <div data-aos="fade-left" className="w-full">
          <div className="bg-gradient-to-tr from-green-50 to-blue-50 p-6 md:p-8 rounded-xl shadow-xl">
            <div className="h-48 w-full rounded-xl bg-gray-200 grid place-content-center overflow-hidden">
              {slides.length ? (
                <marquee direction="left" scrollAmount="5">
                  {slides.map((s) => (
                    <img
                      key={s.id}
                      src={s.imageURL}
                      alt="slide"
                      className="inline-block mx-3 h-44 rounded-xl shadow-lg hover:scale-105 transition"
                    />
                  ))}
                </marquee>
              ) : (
                <p className="text-gray-500">Uploading Panchayat media…</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ PANCHAYAT INFO SECTION */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-ink mb-8" data-aos="fade-up">
          Kasbe Digraj Gram Panchayat
        </h2>

        {/* ✅ PHOTO HIGHLIGHTS */}
        <div
          data-aos="zoom-in"
          className="bg-gradient-to-r from-blue-50 to-green-50 shadow-xl rounded-xl p-6 mb-10"
        >
          <h3 className="font-semibold text-primary mb-3">Photo Highlights</h3>

          {slides.length ? (
            <marquee direction="left" scrollAmount="4">
              {slides.map((s) => (
                <img
                  key={s.id}
                  src={s.imageURL}
                  alt="slide"
                  className="inline-block mx-3 h-40 rounded-xl shadow-lg hover:scale-105 transition"
                />
              ))}
            </marquee>
          ) : (
            <p className="text-gray-500">No photos added yet.</p>
          )}
        </div>

        {/* ✅ MEMBERS */}
        {/* ✅ MEMBERS (Sorted + Grid Layout + Photos Added) */}
{village?.members?.length > 0 && (() => {

  const sortedMembers = [...village.members].sort((a, b) => {
    const order = {
      "sarpanch": 1,
      "up-sarpanch": 2,
      "gram sevak": 3
    };

    const roleA = order[a.role.toLowerCase()] || 99;
    const roleB = order[b.role.toLowerCase()] || 99;

    return roleA - roleB;
  });

  return (
    <div
      data-aos="fade-up"
      className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-6 mb-10"
    >
      <h3 className="font-semibold text-primary mb-3">Panchayat Members</h3>

      {/* GRID LAYOUT */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* 🔽 Final list of members with images */}
        {[
          { name: "shri Riyaj Tamboli", role: "Sarpanch", photo: "src/assets/sarpanch_1.jpeg"},
          { name: "Shri Vinod Gagdale", role: "Up-Sarpanch", photo: "src/assets/Up_Sarpanch_2.jpeg" },
          { name: "Shri Babasaheb Nagargoje", role: "Gram Sevak", photo: "src/assets/GPAdhikari_3.jpg" },
          { name: "Mrs Sunita Nikam", role: "Panchayat Member", photo: "src/assets/1001.jpg" },
          { name: "Shri Dilip Saymote", role: "Panchayat Member", photo: "src/assets/1002.jpeg" },
          { name: "Shri Nikhil Teli", role: "Panchayat Member", photo: "src/assets/1003.jpeg" },
          { name: "Shri Vikram Surywanshi", role: "Panchayat Member", photo: "src/assets/1004.jpeg" },
          { name: "Shri Yogesh Saymote", role: "Panchayat Member", photo: "src/assets/1005.jpeg" },
          { name: "shri Prashant Bhosle", role: "Panchayat Member", photo: "src/assets/1006.jpg" },
          { name: "Shri Dhiraj Gopugade", role: "Panchayat Member", photo: "src/assets/1007.jpg" }
        ].sort((a, b) => {
          const order = {
            "sarpanch": 1,
            "up-sarpanch": 2,
            "gram sevak": 3
          };
          const roleA = order[a.role.toLowerCase()] || 99;
          const roleB = order[b.role.toLowerCase()] || 99;
          return roleA - roleB;
        }).map((m, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-lg p-4 text-center hover:shadow-lg hover:-translate-y-1 transition"
          >
            <img
              src={m.photo}
              className="h-24 w-24 rounded-full object-cover mx-auto mb-2"
            />
            <p className="font-medium flex justify-center items-center gap-1">
              {iconForMember(m.role)} {m.name}
            </p>
            <p className="text-xs text-gray-500">{m.role}</p>
          </div>
        ))}

      </div>
    </div>
  );
})()}


        {/* ✅ SHORT ABOUT */}
        {village && (
          <div
            data-aos="fade-up"
            className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 text-left"
          >
            <p className="text-sub">
              <b>{village.name}</b> is a developing village under the Sangli-Miraj-Kupwad
              region. Panchayat provides services like certificates, complaints, tax
              collection & more.
            </p>

            <div className="mt-3">
              <Link className="text-primary font-semibold hover:underline" to="/about">
                See full Panchayat details →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ✅ POPULAR SERVICES */}
      <section className="container py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Popular Services</h2>
          <Link to="/services" className="text-primary font-semibold hover:underline">
            See all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l7 6v12H5V8z" /></svg>}
            title="Certificates"
            text="Apply for birth, income, caste, residence certificates."
          />
          <FeatureCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 3 8h18z" /></svg>}
            title="Complaints"
            text="Register civic issues and track resolution status."
          />
          <FeatureCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" /></svg>}
            title="Taxes"
            text="View dues & pay house/water tax securely."
          />
          <FeatureCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v16H4z" /></svg>}
            title="Schemes"
            text="Discover government schemes & check eligibility."
          />
        </div>
      </section>

      {/* ✅ ABOUT VILLAGE */}
      {village && (
        <section
          data-aos="fade-up"
          className="container py-10 bg-white/90 backdrop-blur shadow-xl rounded-xl mb-16"
        >
          <h2 className="text-2xl font-bold">About {village.name}</h2>
          <p className="text-sub mt-2">{village.description}</p>

          <div className="mt-4 space-y-1 text-sub text-left">
            <p>📌 <b>Sarpanch:</b> {village.sarpanch}</p>
            <p>📞 <b>Contact:</b> {village.contact}</p>
            <p>👥 <b>Population:</b> {village.population}</p>
          </div>
        </section>
      )}


      {popup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md relative">
            <button className="absolute top-2 right-2" onClick={() => setPopup(null)}>
              <AiOutlineClose size={20} />
            </button>
            <h3 className="text-xl font-bold text-primary mb-2">{popup.title}</h3>
            <p className="text-gray-700">{popup.message}</p>
          </div>
        </div>
      )}


    </main>
  );
}