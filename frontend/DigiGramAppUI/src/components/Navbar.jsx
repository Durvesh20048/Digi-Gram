import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-md py-3 sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-primary tracking-wide">
          DigiGram
        </Link>

        <div className="hidden md:flex gap-6 text-lg">
          <Link className="hover:text-primary transition" to="/about">About Panchayat</Link>
          <Link className="hover:text-primary transition" to="/services">Services</Link>
          <Link className="hover:text-primary transition" to="/contact">Contact</Link>
        </div>

        {user ? (
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
          >
            Dashboard
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Citizen Login
            </Link>
            <Link
              to="/admin/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
