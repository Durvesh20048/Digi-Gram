// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "citizen" | "admin"
  const [profile, setProfile] = useState(null); // ← NEW ✅
  const [loading, setLoading] = useState(true);

  // ✅ Login for ADMIN
  const loginAdmin = (firebaseUser) => {
    setUser(firebaseUser);
    setRole("admin");
    setProfile({ email: firebaseUser.email });
    localStorage.setItem("role", "admin");
  };

  // ✅ Login for CITIZEN
  const loginCitizen = (firebaseUser) => {
    setUser(firebaseUser);
    setRole("citizen");
    localStorage.setItem("role", "citizen");
  };

  // ✅ Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setProfile(null);
    localStorage.removeItem("role");
  };

  // ✅ Runs when app loads or user logs in/out
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(u);
      const savedRole = localStorage.getItem("role");

      // ✅ Auto-detect after refresh
      if (savedRole === "admin") {
        setRole("admin");
        setProfile({ email: u.email });
      } else {
        setRole("citizen");

        // ✅ Fetch citizen profile from Firestore
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        setProfile(snap.exists() ? snap.data() : null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getIdToken = async () =>
    auth.currentUser ? auth.currentUser.getIdToken() : null;

  const value = useMemo(
    () => ({
      user,
      role,
      profile,       // ✅ expose profile
      loginAdmin,
      loginCitizen,
      logout,
      getIdToken,
    }),
    [user, role, profile]
  );

  if (loading) return <p className="text-center py-12">Loading...</p>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
