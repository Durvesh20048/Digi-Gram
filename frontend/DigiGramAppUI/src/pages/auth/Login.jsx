// src/pages/auth/Login.jsx
import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import { auth, db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState("enter"); // "enter" | "otp"
  const [loading, setLoading] = useState(false);
  const recaptcha = useRef(null);
  const { loginCitizen } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!recaptcha.current) {
      recaptcha.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const full = phone.startsWith("+") ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, full, recaptcha.current);
      window._confirmation = result;
      setPhase("otp");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await window._confirmation.confirm(otp);

      // ✅ Save citizen to Firestore (if not already)
      await setDoc(
        doc(db, "users", res.user.uid),
        {
          uid: res.user.uid,
          phone: res.user.phoneNumber,
          fullName: "",
          address: "",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      loginCitizen(res.user);

      nav("/dashboard/citizen");
    } catch (err) {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <main className="container max-w-md py-12">
      <h1 className="text-3xl font-bold mb-6">Citizen Login</h1>
      <div id="recaptcha-container" />

      {phase === "enter" ? (
        <form
          onSubmit={sendOtp}
          className="space-y-4 bg-white p-6 rounded-xl shadow"
        >
          <input
            className="input"
            placeholder="Mobile number (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={verify}
          className="space-y-4 bg-white p-6 rounded-xl shadow"
        >
          <input
            className="input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      )}
    </main>
  );
}
