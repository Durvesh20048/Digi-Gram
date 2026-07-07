// // // src/pages/Dashboard/CitizenComplaint.jsx
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { collection, addDoc } from "firebase/firestore";
// // import { db } from "../../firebase";
// // import { useAuth } from "../../context/AuthContext";
// // import CitizenLayout from "../../layouts/CitizenLayout";


// // export default function CitizenComplaint() {
// //   const { user } = useAuth();
// //   const [title, setTitle] = useState("");
// //   const [details, setDetails] = useState("");
// //   const [location, setLocation] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState("");
// //   const nav = useNavigate();

// //   const getLocation = () => {
// //     navigator.geolocation.getCurrentPosition(
// //       (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
// //       () => alert("Unable to fetch location")
// //     );
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault(); setLoading(true);
// //     try {
// //       await addDoc(collection(db, "complaints"), {
// //         userId: user?.phoneNumber || "unknown",
// //         title,
// //         details,
// //         lat: location?.lat || null,
// //         lon: location?.lon || null,
// //         image: null,
// //         status: "Pending",
// //         createdAt: Date.now(),
// //       });
// //       setSuccess("✅ Complaint submitted!");
// //       setTitle(""); setDetails(""); setLocation(null);
// //       setTimeout(()=>nav("/dashboard/complaints"), 800);
// //     } catch (err) { alert(err.message); }
// //     setLoading(false);
// //   };

// //   return (
// //      <CitizenLayout title="Register Complaint">
// //     <main className="container py-10 space-y-6 max-w-2xl animate-fade">
// //       <h1 className="text-3xl font-bold">Register Complaint</h1>
// //       {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
// //       <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-xl shadow">
// //         <input className="input" placeholder="Complaint Title" value={title} onChange={e=>setTitle(e.target.value)} required />
// //         <textarea className="input h-24" placeholder="Describe the issue" value={details} onChange={e=>setDetails(e.target.value)} required />
// //         <button type="button" className="btn-accent" onClick={getLocation}>📍 Use My Location</button>
// //         {location && <p className="text-sm text-green-700">Saved: {location.lat}, {location.lon}</p>}
// //         <button className="btn-primary w-full" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
// //       </form>
// //     </main>
// //     </CitizenLayout>
// //   );
// // }
// // src/pages/Dashboard/CitizenComplaint.jsx
// import React, { useEffect, useState } from "react";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebase";
// import { supabase } from "../../supabase.js";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import CitizenLayout from "../../layouts/CitizenLayout";

// /**
//  * FINAL OPTIMIZED COMPLAINT FORM
//  * - Cloudinary image upload (max 3 images)
//  * - Supabase PDF upload
//  * - Mobile camera support (rear camera)
//  * - Auto-fill address from profile
//  * - Clean UI, stable logic, and full error handling
//  */

// export default function CitizenComplaint() {
//   const { user, profile: userProfile } = useAuth();
//   const nav = useNavigate();

//   // Form state
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [incidentDate, setIncidentDate] = useState("");

//   const [address, setAddress] = useState({
//     addressLine1: "",
//     addressLine2: "",
//     village: "",
//     taluka: "",
//     district: "",
//     state: "Maharashtra",
//     pincode: "",
//   });

//   const [lat, setLat] = useState("");
//   const [lng, setLng] = useState("");

//   const [images, setImages] = useState([]);
//   const [documentFile, setDocumentFile] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");

//   // Autofill address from profile
//   useEffect(() => {
//     if (userProfile) {
//       setAddress((prev) => ({
//         ...prev,
//         addressLine1: userProfile.addressLine1 || prev.addressLine1,
//         village: userProfile.village || prev.village,
//         taluka: userProfile.taluka || prev.taluka,
//         district: userProfile.district || prev.district,
//         state: userProfile.state || prev.state,
//         pincode: userProfile.pincode || prev.pincode,
//       }));
//     }
//   }, [userProfile]);

//   /* ----------------------------------------------------
//      CLOUDINARY IMAGE UPLOAD
//   ---------------------------------------------------- */
//   const uploadImageCloudinary = async (file) => {
//     if (!file) return null;

//     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//     const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
//     const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

//     if (!cloudName || !preset) {
//       console.error("Cloudinary ENV missing");
//       return null;
//     }

//     const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("upload_preset", preset);
//     fd.append("api_key", apiKey);

//     try {
//       const res = await fetch(url, { method: "POST", body: fd });
//       const data = await res.json();
//       if (!res.ok) {
//         console.error("Cloudinary error", data);
//         return null;
//       }
//       return data.secure_url;
//     } catch (err) {
//       console.error("Cloudinary upload error:", err);
//       return null;
//     }
//   };

//   /* ----------------------------------------------------
//      SUPABASE PDF UPLOAD
//   ---------------------------------------------------- */
//   const uploadPDFtoSupabase = async (file, uid) => {
//     if (!file) return null;

//     const path = `complaint_docs/${uid}_${Date.now()}_${file.name}`;

//     const { data, error } = await supabase.storage
//       .from("pdf-storage")
//       .upload(path, file, {
//         contentType: "application/pdf",
//         cacheControl: "0",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Supabase PDF upload error:", error);
//       return null;
//     }

//     const { data: urlData } = supabase.storage
//       .from("pdf-storage")
//       .getPublicUrl(path);

//     return urlData?.publicUrl || null;
//   };

//   /* ----------------------------------------------------
//      LOCATION CAPTURE
//   ---------------------------------------------------- */
//   const captureLocation = () => {
//     if (!navigator.geolocation)
//       return alert("Your device does not support location.");

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLat(String(pos.coords.latitude));
//         setLng(String(pos.coords.longitude));
//       },
//       (err) => {
//         console.error("Location error:", err);
//         alert("Please enable GPS and try again.");
//       }
//     );
//   };

//   /* ----------------------------------------------------
//      ADD IMAGES (Mobile Camera Supported)
//   ---------------------------------------------------- */
//   const onPickImage = (event) => {
//     const selected = Array.from(event.target.files || []);
//     const final = [...images, ...selected].slice(0, 3);
//     setImages(final);
//   };

//   const removeImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   /* ----------------------------------------------------
//      SUBMIT FORM
//   ---------------------------------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return alert("Please log in.");

//     if (!title || !category || !description)
//       return alert("Please complete all required fields.");

//     setLoading(true);

//     try {
//       // Upload images
//       const uploadedImages = [];
//       for (let f of images) {
//         const img = await uploadImageCloudinary(f);
//         if (img) uploadedImages.push(img);
//       }

//       // Upload PDF
//       const uploadedDoc =
//         documentFile && (await uploadPDFtoSupabase(documentFile, user.uid));

//       /* ------------------------------------------
//          BUILD COMPLAINT OBJECT
//       ------------------------------------------ */
//       const complaint = {
//         userId: user.uid,
//         userPhone: user.phoneNumber || null,

//         title,
//         category,
//         description,
//         incidentDate: incidentDate || null,

//         address,
//         lat,
//         lng,

//         images: uploadedImages,
//         documentUrl: uploadedDoc || null,

//         status: "Pending",
//         priority: "Medium",
//         assignedTo: null,

//         timeline: [
//           {
//             status: "Pending",
//             note: "Complaint submitted by citizen",
//             timestamp: Date.now(),
//           },
//         ],

//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       // Save into Firestore
//       const ref = await addDoc(collection(db, "complaints"), complaint);

//       setSuccessMsg("Complaint submitted successfully!");
//       setTimeout(() => nav(`/dashboard/complaints/${ref.id}`), 1000);
//     } catch (err) {
//       console.error("Error submitting:", err);
//       alert("Failed to submit complaint. Try again.");
//     }

//     setLoading(false);
//   };

//   /* ----------------------------------------------------
//      UI START
//   ---------------------------------------------------- */
//   return (
//     <CitizenLayout title="Register Complaint">
//       <main className="max-w-3xl mx-auto p-6">
//         <h1 className="text-2xl font-semibold mb-4">Register Complaint</h1>

//         {successMsg && (
//           <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
//             {successMsg}
//           </div>
//         )}

//         <form className="space-y-6 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
//           {/* TITLE */}
//           <div>
//             <label className="text-sm font-medium">Complaint Title *</label>
//             <input
//               className="input mt-1"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Short and clear title"
//               required
//             />
//           </div>

//           {/* CATEGORY */}
//           <div>
//             <label className="text-sm font-medium">Category *</label>
//             <select
//               className="input mt-1"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//             >
//               <option value="">Select category</option>
//               <option>Water Supply</option>
//               <option>Road / Drainage</option>
//               <option>Sanitation / Garbage</option>
//               <option>Electricity / Street Light</option>
//               <option>Health / Public Safety</option>
//               <option>Agriculture</option>
//               <option>Property / Tax</option>
//               <option>Documentation Issue</option>
//               <option>Other</option>
//             </select>
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="text-sm font-medium">Description *</label>
//             <textarea
//               className="input mt-1 h-28"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Provide detailed description of the issue"
//               required
//             />
//           </div>

//           {/* INCIDENT DATE + LOCATION */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Incident Date</label>
//               <input
//                 type="date"
//                 className="input mt-1"
//                 value={incidentDate}
//                 onChange={(e) => setIncidentDate(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Location</label>
//               <div className="flex gap-3 mt-1 items-center">
//                 <button
//                   type="button"
//                   className="btn-accent"
//                   onClick={captureLocation}
//                 >
//                   📍 Capture Location
//                 </button>

//                 <div className="text-xs text-gray-600">
//                   <div>Lat: {lat || "-"}</div>
//                   <div>Lng: {lng || "-"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ADDRESS FIELDS */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Address</label>
//             <input
//               className="input"
//               placeholder="Address Line 1"
//               value={address.addressLine1}
//               onChange={(e) =>
//                 setAddress({ ...address, addressLine1: e.target.value })
//               }
//             />
//             <input
//               className="input"
//               placeholder="Address Line 2"
//               value={address.addressLine2}
//               onChange={(e) =>
//                 setAddress({ ...address, addressLine2: e.target.value })
//               }
//             />

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <input
//                 className="input"
//                 placeholder="Village"
//                 value={address.village}
//                 onChange={(e) =>
//                   setAddress({ ...address, village: e.target.value })
//                 }
//               />

//               <input
//                 className="input"
//                 placeholder="Taluka"
//                 value={address.taluka}
//                 onChange={(e) =>
//                   setAddress({ ...address, taluka: e.target.value })
//                 }
//               />

//               <input
//                 className="input"
//                 value={`${address.district}, ${address.state} - ${address.pincode}`}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* IMAGE UPLOAD */}
//           <div>
//             <label className="text-sm font-medium">Photo Attachments (Max 3)</label>

//             <div className="flex gap-3 mt-2">
//               {/* Camera */}
//               <label className="btn-accent cursor-pointer">
//                 📸 Capture Photo
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={onPickImage}
//                   className="hidden"
//                 />
//               </label>

//               {/* Gallery */}
//               <label className="btn-ghost cursor-pointer">
//                 📁 Choose From Gallery
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={onPickImage}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             {/* Preview */}
//             {images.length > 0 && (
//               <div className="flex gap-2 mt-3 flex-wrap">
//                 {images.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="relative w-24 h-24 rounded border overflow-hidden"
//                   >
//                     <img
//                       src={URL.createObjectURL(file)}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(idx)}
//                       className="absolute top-1 right-1 bg-black/50 text-white px-1 text-xs rounded"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* PDF UPLOAD */}
//           <div>
//             <label className="text-sm font-medium">Attach Document (PDF)</label>
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
//               className="mt-1"
//             />
//             {documentFile && (
//               <p className="text-sm text-gray-600 mt-1">{documentFile.name}</p>
//             )}
//           </div>

//           {/* SUBMIT BUTTON */}
//           <div>
//             <button
//               type="submit"
//               className="btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Submit Complaint"}
//             </button>
//           </div>
//         </form>
//       </main>
//     </CitizenLayout>
//   );
// }
// src/pages/Dashboard/CitizenComplaintList.jsx


// src/pages/Dashboard/CitizenComplaint.jsx
// import React, { useEffect, useState } from "react";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebase";
// import { supabase } from "../../supabase";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import CitizenLayout from "../../layouts/CitizenLayout";

// // Helper: upload to Cloudinary (unsigned preset)
// async function uploadImageCloudinary(file) {
//   if (!file) return null;
//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
//   if (!cloudName || !preset) return null;
//   const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
//   const fd = new FormData();
//   fd.append("file", file);
//   fd.append("upload_preset", preset);
//   try {
//     const res = await fetch(url, { method: "POST", body: fd });
//     const data = await res.json();
//     if (!res.ok) return null;
//     return data.secure_url;
//   } catch (e) { console.error(e); return null; }
// }

// async function uploadPDFtoSupabase(file, uid) {
//   if (!file) return null;
//   const bucket = "pdf-storage";
//   const path = `complaint_docs/${uid}_${Date.now()}_${file.name}`;
//   const { error } = await supabase.storage.from(bucket).upload(path, file, {
//     cacheControl: "3600",
//     upsert: false,
//     contentType: file.type || "application/pdf",
//   });
//   if (error) { console.error("Supabase upload error", error); return null; }
//   const { data } = supabase.storage.from(bucket).getPublicUrl(path);
//   return data?.publicUrl || null;
// }

// export default function CitizenComplaint() {
//   const { user, profile: userProfile } = useAuth();
//   const nav = useNavigate();

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [incidentDate, setIncidentDate] = useState("");
//   const [address, setAddress] = useState({ addressLine1: "", village: "", taluka: "", district: "", state: "Maharashtra", pincode: "" });
//   const [lat, setLat] = useState("");
//   const [lng, setLng] = useState("");

//   const [images, setImages] = useState([]);
//   const [documentFile, setDocumentFile] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     if (userProfile) {
//       setAddress(p => ({ ...p,
//         addressLine1: userProfile.addressLine1 || p.addressLine1,
//         village: userProfile.village || p.village,
//         taluka: userProfile.taluka || p.taluka,
//         district: userProfile.district || p.district,
//         state: userProfile.state || p.state,
//         pincode: userProfile.pincode || p.pincode,
//       }));
//     }
//   }, [userProfile]);

//   const captureLocation = () => {
//     if (!navigator.geolocation) return alert("Geolocation not supported");
//     navigator.geolocation.getCurrentPosition(
//       pos => { setLat(String(pos.coords.latitude)); setLng(String(pos.coords.longitude)); },
//       err => { console.error(err); alert("Location denied"); },
//       { enableHighAccuracy: true }
//     );
//   };

//   const onPickImage = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImages(prev => [...prev, ...files].slice(0, 3));
//   };

//   const removeImage = idx => setImages(prev => prev.filter((_, i) => i !== idx));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return alert("Please login");
//     if (!title || !category || !description) return alert("Fill required fields");

//     setLoading(true);
//     try {
//       // upload images
//       const uploadedImages = [];
//       for (const f of images) {
//         const u = await uploadImageCloudinary(f);
//         if (u) uploadedImages.push(u);
//       }

//       // upload pdf
//       const uploadedDoc = documentFile ? await uploadPDFtoSupabase(documentFile, user.uid) : null;

//       const complaint = {
//         userId: user.uid,
//         userPhone: user.phoneNumber || null,
//         title: title.trim(),
//         category,
//         description: description.trim(),
//         incidentDate: incidentDate || null,
//         address,
//         lat: lat || null,
//         lng: lng || null,
//         images: uploadedImages,
//         documentUrl: uploadedDoc || null,
//         status: "Pending",
//         priority: "Medium",
//         assignedTo: null,
//         timeline: [{ status: "Pending", note: "Submitted", timestamp: Date.now() }],
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       const ref = await addDoc(collection(db, "complaints"), complaint);
//       setMsg("Submitted successfully");
//       setTimeout(() => nav(`/dashboard/complaints/view/${ref.id}`), 700);
//     } catch (err) {
//       console.error(err); alert("Submit failed");
//     } finally { setLoading(false); }
//   };

//   return (
//     <CitizenLayout title="Register Complaint">
//       <main className="max-w-3xl mx-auto p-6">
//         <h2 className="text-xl font-semibold mb-4">Register Complaint</h2>
//         {msg && <div className="p-2 bg-green-100 text-green-700 rounded mb-4">{msg}</div>}

//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
//           <div>
//             <label className="text-sm font-medium">Title *</label>
//             <input className="input mt-1" value={title} onChange={e=>setTitle(e.target.value)} required />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Category *</label>
//             <select className="input mt-1" value={category} onChange={e=>setCategory(e.target.value)} required>
//               <option value="">Select</option>
//               <option>Water Supply</option>
//               <option>Road / Drainage</option>
//               <option>Sanitation / Garbage</option>
//               <option>Electricity</option>
//               <option>Health</option>
//               <option>Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Description *</label>
//             <textarea className="input mt-1 h-28" value={description} onChange={e=>setDescription(e.target.value)} required />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="text-sm">Incident date</label>
//               <input type="date" className="input mt-1" value={incidentDate} onChange={e=>setIncidentDate(e.target.value)} />
//             </div>

//             <div>
//               <label className="text-sm">Location</label>
//               <div className="flex items-center gap-3 mt-1">
//                 <button type="button" onClick={captureLocation} className="btn-accent">📍 Capture</button>
//                 <div className="text-xs text-gray-600">
//                   <div>Lat: {lat || "-"}</div>
//                   <div>Lng: {lng || "-"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="text-sm">Address</label>
//             <input className="input mt-1" placeholder="Address line 1" value={address.addressLine1} onChange={e=>setAddress({...address, addressLine1: e.target.value})} />
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
//               <input className="input" placeholder="Village" value={address.village} onChange={e=>setAddress({...address, village: e.target.value})} />
//               <input className="input" placeholder="Taluka" value={address.taluka} onChange={e=>setAddress({...address, taluka: e.target.value})} />
//               <input className="input" placeholder="Pincode" value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})} />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm">Photos (max 3)</label>
//             <div className="flex gap-2 mt-2">
//               <label className="btn-accent cursor-pointer">
//                 📸 Capture
//                 <input type="file" accept="image/*" capture="environment" onChange={onPickImage} className="hidden" />
//               </label>
//               <label className="btn-ghost cursor-pointer">
//                 📁 Gallery
//                 <input type="file" accept="image/*" multiple onChange={onPickImage} className="hidden" />
//               </label>
//             </div>

//             {images.length > 0 && (
//               <div className="mt-3 flex gap-2 flex-wrap">
//                 {images.map((f, i) => (
//                   <div key={i} className="relative w-24 h-24 rounded border overflow-hidden">
//                     <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover"/>
//                     <button type="button" onClick={()=>removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white px-1 rounded">✕</button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="text-sm">Attach PDF (optional)</label>
//             <input type="file" accept="application/pdf" onChange={e=>setDocumentFile(e.target.files?.[0]||null)} className="mt-1" />
//             {documentFile && <div className="text-sm text-gray-600 mt-1">{documentFile.name}</div>}
//           </div>

//           <div className="flex gap-3">
//             <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
//             <button type="button" className="btn-ghost" onClick={()=>{ setTitle(""); setCategory(""); setDescription(""); setImages([]); setDocumentFile(null); }}>Clear</button>
//           </div>
//         </form>
//       </main>
//     </CitizenLayout>
//   );
// }
import React, { useState } from "react";
import axios from "axios";  // ✅ REQUIRED
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CitizenLayout from "../../layouts/CitizenLayout";


// const API_URL = "http://localhost:8080/api/complaints";
const API_URL = "http://localhost:8080/api/complaints";


async function uploadImageCloudinary(file) {
  if (!file) {
    console.error("No file provided to Cloudinary");
    return null;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  if (!cloudName || !preset) {
    console.error("Cloudinary ENV missing", { cloudName, preset });
    return null;
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "complaints"); // ✅ force folder

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Cloudinary Upload Failed:", text);
      return null;
    }

    const data = JSON.parse(text);
    return data.secure_url;

  } catch (error) {
    console.error("Cloudinary error:", error);
    return null;
  }
}


// ---------- Supabase PDF Upload ----------
async function uploadPDFtoSupabase(file, uid) {
  if (!file) return null;
  const path = `complaint_docs/${uid}_${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from("pdf-storage").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("pdf-storage").getPublicUrl(path);
  return data?.publicUrl || null;
}

// ---------- MAIN COMPONENT ----------
export default function CitizenComplaint() {
  const { user, profile } = useAuth();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [address, setAddress] = useState("");

  const [images, setImages] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Add images (camera/gallery)
  const onPickImage = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 3));
  };

  // Remove image
  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit complaint
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) return alert("Please login first");

  setLoading(true);
  try {
    const uploadedImages = [];
    for (const img of images) {
      const url = await uploadImageCloudinary(img);
      if (url) uploadedImages.push(url);
    }

    const uploadedDoc = documentFile
      ? await uploadPDFtoSupabase(documentFile, user.uid)
      : null;

    const backendPayload = {
      citizenId: user.uid,
      citizenPhone: user.phoneNumber,
      citizenName: profile?.fullName || "",
      title,
      category,
      description,
      incidentDate,
      address,
      imageUrl: uploadedImages,
      documentUrl: uploadedDoc
    };

    const res = await axios.post(
      "http://localhost:8080/api/complaints",
      backendPayload
    );

    setMsg("✅ Submitted successfully! Priority: " + res.data.priority);

    setTimeout(() => {
      nav(`/dashboard/complaints/view/${res.data.id}`);
    }, 800);

  } catch (err) {
    console.error("Complaint submit error:", err);
    alert("Submission failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <CitizenLayout title="Register Complaint">
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Register Complaint</h2>
        {msg && <div className="p-2 bg-green-100 text-green-700 rounded">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">

          <input className="input" placeholder="Complaint Title"
            value={title} onChange={e=>setTitle(e.target.value)} required />

          <select className="input" value={category}
            onChange={e=>setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option>Water Supply</option>
            <option>Road</option>
            <option>Electricity</option>
            <option>Sanitation</option>
            <option>Health</option>
            <option>Other</option>
          </select>

          <textarea className="input h-28"
            placeholder="Describe the problem"
            value={description} onChange={e=>setDescription(e.target.value)} required />

          <input type="date" className="input"
            value={incidentDate}
            onChange={e=>setIncidentDate(e.target.value)} />

          <input className="input" placeholder="Address"
            value={address} onChange={e=>setAddress(e.target.value)} />

          {/* CAMERA + GALLERY */}
          <div>
            <label className="text-sm font-medium">Attach Photos (Max 3)</label>
            <div className="flex gap-3 mt-2">

              <label className="btn-accent cursor-pointer">
                📸 Take Photo
                <input type="file" accept="image/*" capture="environment"
                  onChange={onPickImage} className="hidden" />
              </label>

              <label className="btn-ghost cursor-pointer">
                📁 Select Images
                <input type="file" accept="image/*" multiple
                  onChange={onPickImage} className="hidden" />
              </label>
            </div>

            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {images.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover"/>
                    <button type="button" onClick={()=>removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF UPLOAD */}
          <div>
            <label className="text-sm">Attach PDF (Optional)</label>
            <input type="file" accept="application/pdf"
              onChange={e=>setDocumentFile(e.target.files[0])}/>
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>

        </form>
      </main>
    </CitizenLayout>
  );
}
