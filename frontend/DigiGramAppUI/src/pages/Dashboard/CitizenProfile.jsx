// // src/pages/Dashboard/CitizenProfile.jsx
// import { useState, useEffect } from "react";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useAuth } from "../../context/AuthContext";
// import CitizenLayout from "../../layouts/CitizenLayout";

// export default function CitizenProfile() {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savedMsg, setSavedMsg] = useState("");

//   const [profile, setProfile] = useState({
//     name: "",
//     aadhaar: "",
//     address: "",
//     village: "",
//     pincode: "",
//     phone: "",
//   });

//   // ✅ Load profile from Firestore
//   useEffect(() => {
//     const loadProfile = async () => {
//       if (!user) return;

//       const userId = user.uid;
//       const ref = doc(db, "users", userId);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         setProfile({ ...snap.data(), phone: user.phoneNumber });
//       } else {
//         setProfile((p) => ({ ...p, phone: user.phoneNumber }));
//       }

//       setLoading(false);
//     };

//     loadProfile();
//   }, [user]);

//   // ✅ Save profile
//   const saveProfile = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     await setDoc(doc(db, "users", user.uid), profile, { merge: true });

//     setSaving(false);
//     setSavedMsg("✅ Profile updated successfully!");

//     setTimeout(() => setSavedMsg(""), 2000);
//   };

//   return (
//     <CitizenLayout title="My Profile">
//       {loading ? (
//         <p className="py-12 text-center">Loading profile...</p>
//       ) : (
//         <form
//           onSubmit={saveProfile}
//           className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
//         >
//           {savedMsg && (
//             <p className="bg-green-100 text-green-700 p-2 rounded text-center">
//               {savedMsg}
//             </p>
//           )}

//           <Input
//             label="Full Name"
//             value={profile.name}
//             onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//           />

//           <Input
//             label="Aadhaar Number"
//             value={profile.aadhaar}
//             onChange={(e) => setProfile({ ...profile, aadhaar: e.target.value })}
//           />

//           <Input
//             label="Address"
//             value={profile.address}
//             onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//           />

//           <div className="grid sm:grid-cols-2 gap-3">
//             <Input
//               label="Village"
//               value={profile.village}
//               onChange={(e) => setProfile({ ...profile, village: e.target.value })}
//             />

//             <Input
//               label="Pin Code"
//               value={profile.pincode}
//               onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
//             />
//           </div>

//           <Input label="Phone" value={profile.phone} disabled />

//           <button className="btn-primary w-full" disabled={saving}>
//             {saving ? "Saving..." : "Save Profile"}
//           </button>
//         </form>
//       )}
//     </CitizenLayout>
//   );
// }

// function Input({ label, value, onChange, disabled }) {
//   return (
//     <div className="space-y-1">
//       <label className="font-medium">{label}</label>
//       <input
//         className="input"
//         value={value || ""}
//         disabled={disabled}
//         onChange={onChange}
//       />
//     </div>
//   );
// }
// src/pages/Dashboard/CitizenProfile.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { supabase } from "../../supabase.js";
import { useAuth } from "../../context/AuthContext";
import CitizenLayout from "../../layouts/CitizenLayout";

/**
 * FINAL VERSION – React 19 + Vite Compatible
 * Firebase Auth + Firestore
 * Cloudinary (unsigned upload + api_key) for images
 * Supabase Storage for PDFs
 */

export default function CitizenProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const [profile, setProfile] = useState({
    uid: "",
    phone: "",
    name: "",
    aadhaar: "",
    dob: "",
    gender: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    village: "",
    taluka: "",
    district: "",
    state: "Maharashtra",
    pincode: "",
    lat: "",
    lng: "",

    profilePhotoUrl: "",
    aadhaarFrontUrl: "",
    aadhaarBackUrl: "",
    residenceProofUrl: "",
    createdAt: null,
    updatedAt: null,
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    aadhaarFront: null,
    aadhaarBack: null,
    residenceProof: null,
  });

  // Load user profile
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const refDoc = doc(db, "citizenProfiles", user.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          const data = snap.data();
          setProfile((p) => ({
            ...p,
            ...data,
            uid: user.uid,
            phone: data.phone || user.phoneNumber,
          }));
        } else {
          setProfile((p) => ({ ...p, uid: user.uid, phone: user.phoneNumber }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Helpers
  const handleChange = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (key, file) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

  /* -----------------------------------------------------------
   * CLOUDINARY UPLOAD (NEW WORKING VERSION)
   * Cloudinary (Unsigned Upload + API Key)
   * --------------------------------------------------------- */
  const uploadImageCloudinary = async (file) => {
    if (!file) return null;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("api_key", apiKey);

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary Upload Error:", data);
      return null;
    }

    return data.secure_url;
  };

  /* -----------------------------------------------------------
   * SUPABASE PDF UPLOAD
   * --------------------------------------------------------- */
  const uploadPDFtoSupabase = async (file, uid) => {
    if (!file) return null;

    const bucket = "pdf-storage";
    const filePath = `profile_docs/${uid}_${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl ?? null;
  };

  /* -----------------------------------------------------------
   * SAVE PROFILE
   * --------------------------------------------------------- */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const uid = user.uid;

      // Image uploads
      const uploadedProfilePhoto =
        files.profilePhoto &&
        (await uploadImageCloudinary(files.profilePhoto));

      const uploadedAadhaarFront =
        files.aadhaarFront &&
        (await uploadImageCloudinary(files.aadhaarFront));

      const uploadedAadhaarBack =
        files.aadhaarBack &&
        (await uploadImageCloudinary(files.aadhaarBack));

      // PDF upload
      const uploadedResidenceProof =
        files.residenceProof &&
        (await uploadPDFtoSupabase(files.residenceProof, uid));

      const finalData = {
        ...profile,
        uid,

        profilePhotoUrl:
          uploadedProfilePhoto || profile.profilePhotoUrl,
        aadhaarFrontUrl:
          uploadedAadhaarFront || profile.aadhaarFrontUrl,
        aadhaarBackUrl:
          uploadedAadhaarBack || profile.aadhaarBackUrl,
        residenceProofUrl:
          uploadedResidenceProof || profile.residenceProofUrl,

        updatedAt: serverTimestamp(),
        createdAt: profile.createdAt || serverTimestamp(),
      };

      await setDoc(doc(db, "citizenProfiles", uid), finalData, {
        merge: true,
      });

      setSavedMsg("Profile saved successfully!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save profile.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <CitizenLayout title="Citizen Profile">
        <p className="text-center p-6">Loading...</p>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout title="Citizen Profile">
      <form className="max-w-4xl mx-auto p-4 space-y-6" onSubmit={handleSave}>
        
        {/* PERSONAL DETAILS */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Personal Details</h2>

          <div className="flex items-center gap-4">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                No Photo
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange("profilePhoto", e.target.files[0])
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Full Name" value={profile.name} onChange={(v) => handleChange("name", v)} />
            <Input label="Mobile" value={profile.phone} disabled />
            <Input label="Aadhaar" value={profile.aadhaar} onChange={(v) => handleChange("aadhaar", v)} />
            <Input type="date" label="Date of Birth" value={profile.dob} onChange={(v) => handleChange("dob", v)} />

            <Select
              label="Gender"
              value={profile.gender}
              onChange={(v) => handleChange("gender", v)}
              options={[
                { value: "", label: "Select" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />

            <Input label="Email" value={profile.email} onChange={(v) => handleChange("email", v)} />
          </div>
        </section>

        {/* ADDRESS */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Address Line 1" value={profile.addressLine1} onChange={(v) => handleChange("addressLine1", v)} />
            <Input label="Address Line 2" value={profile.addressLine2} onChange={(v) => handleChange("addressLine2", v)} />
            <Input label="Village" value={profile.village} onChange={(v) => handleChange("village", v)} />
            <Input label="Taluka" value={profile.taluka} onChange={(v) => handleChange("taluka", v)} />
            <Input label="District" value={profile.district} onChange={(v) => handleChange("district", v)} />
            <Input label="State" value={profile.state} onChange={(v) => handleChange("state", v)} />
            <Input label="Pincode" value={profile.pincode} onChange={(v) => handleChange("pincode", v)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Latitude" value={profile.lat} onChange={(v) => handleChange("lat", v)} />
            <Input label="Longitude" value={profile.lng} onChange={(v) => handleChange("lng", v)} />

            <button type="button" className="btn-primary" onClick={() => {
              navigator.geolocation.getCurrentPosition((pos) => {
                handleChange("lat", pos.coords.latitude);
                handleChange("lng", pos.coords.longitude);
              });
            }}>
              Use My Location
            </button>
          </div>
        </section>

        {/* DOCUMENTS */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Documents</h2>

          <FileInput label="Aadhaar Front" existingUrl={profile.aadhaarFrontUrl} onChange={(file) => handleFileChange("aadhaarFront", file)} />

          <FileInput label="Aadhaar Back" existingUrl={profile.aadhaarBackUrl} onChange={(file) => handleFileChange("aadhaarBack", file)} />

          <FileInput
            label="Residence Proof (PDF)"
            existingUrl={profile.residenceProofUrl}
            accept=".pdf,image/*"
            onChange={(file) => handleFileChange("residenceProof", file)}
          />
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-between items-center">
          {savedMsg && <div className="text-green-600">{savedMsg}</div>}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </CitizenLayout>
  );
}

/* --------------------------------------------
 * REUSABLE COMPONENTS
 * -------------------------------------------- */

function Input({ label, value, onChange, disabled, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        className="input"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, existingUrl, onChange, accept = "image/*" }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      {existingUrl && (
        <a
          href={existingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View Existing
        </a>
      )}

      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}
