// // src/pages/auth/AdminLogin.jsx
// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("admin@panchayat.gov.in"); // change as you create in Firebase
//   const [password, setPassword] = useState("Admin#12345");       // change as you create in Firebase
//   const [err, setErr] = useState("");
//   const { loginAdmin } = useAuth();
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     try {
//       const res = await signInWithEmailAndPassword(auth, email, password);
//       loginAdmin(res.user);
//       nav("/dashboard/admin");
//     } catch (error) {
//       setErr(error.message);
//     }
//   };

//   return (
//     <main className="container max-w-md py-12">
//       <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
//       <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl shadow">
//         <input className="input" placeholder="Admin email" value={email} onChange={(e)=>setEmail(e.target.value)} />
//         <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
//         {err && <p className="text-red-600 text-sm">{err}</p>}
//         <button className="btn-accent w-full">Sign In</button>
//       </form>
//     </main>
//   );
// }
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@panchayat.gov.in");
  const [password, setPassword] = useState("Admin#12345");
  const [err, setErr] = useState("");
  const { loginAdmin } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      loginAdmin(res.user);
      nav("/dashboard/admin");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>

        <form onSubmit={submit} className="space-y-5">
          <input
            className="w-full border px-4 py-3 rounded-lg outline-primary"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border px-4 py-3 rounded-lg outline-primary"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
// admin login