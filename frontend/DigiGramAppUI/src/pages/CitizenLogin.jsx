// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext.jsx'
// import { initializeApp } from 'firebase/app'
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
// import axios from 'axios'
// import firebaseConfig from '../firebase.js'

// const app = initializeApp(firebaseConfig)
// const auth = getAuth(app)

// export default function CitizenLogin() {
//   const [phone, setPhone] = useState('')
//   const [code, setCode] = useState('')
//   const [step, setStep] = useState(1)
//   const [error, setError] = useState(null)
//   const nav = useNavigate()
//   const { login } = useAuth()

//   useEffect(() => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
//     }
//   }, [])

//   const sendOtp = async (e) => {
//     e.preventDefault()
//     setError(null)
//     try {
//       const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
//       window.confirmationResult = confirmation
//       setStep(2)
//     } catch (e) {
//       setError(e.message)
//     }
//   }

//   const verifyOtp = async (e) => {
//     e.preventDefault()
//     setError(null)
//     try {
//       const result = await window.confirmationResult.confirm(code)
//       const idToken = await result.user.getIdToken()
//       const res = await axios.post('/api/auth/exchange', { idToken })
//       login(res.data.token, res.data.role)
//       nav('/dashboard')
//     } catch (e) {
//       setError(e.message)
//     }
//   }

//   return (
//     <div>
//       <h2>Citizen OTP Login</h2>
//       <div id="recaptcha-container"></div>
//       {step === 1 && (
//         <form onSubmit={sendOtp} style={{display:'grid', gap:8, maxWidth:360}}>
//           <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
//           <button type="submit">Send OTP</button>
//         </form>
//       )}
//       {step === 2 && (
//         <form onSubmit={verifyOtp} style={{display:'grid', gap:8, maxWidth:360}}>
//           <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter OTP" />
//           <button type="submit">Verify</button>
//         </form>
//       )}
//       {error && <div style={{color:'red'}}>{error}</div>}
//     </div>
//   )
// }
// citizen login

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import axios from "axios";
import firebaseConfig from "../firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function CitizenLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  }, []);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmation;
      setStep(2);
    } catch (e) {
      setError(e.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await window.confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();
      const res = await axios.post("/api/auth/exchange", { idToken });
      login(res.data.token, res.data.role);
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Citizen OTP Login
        </h2>

        <div id="recaptcha-container"></div>

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="w-full border px-4 py-3 rounded-lg outline-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-4 py-3 rounded-lg outline-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}