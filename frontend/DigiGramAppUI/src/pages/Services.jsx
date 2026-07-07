import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Services() {
  const { user } = useAuth();

  return (
    <main className="container py-16 space-y-10">
      <h1 className="text-3xl font-bold">Services</h1>

      {!user ? (
        <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-lg font-semibold text-yellow-700">
            You must login to access services
          </p>
          <Link to="/login" className="btn-primary mt-3 inline-block">
            Login Now
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Link className="serviceCard" to="/dashboard/complaint">Complaints</Link>
          <Link className="serviceCard" to="/dashboard/certificates">Certificates</Link>
          <Link className="serviceCard" to="/dashboard/tax">Pay Taxes</Link>
          <Link className="serviceCard" to="/dashboard/schemes">Schemes</Link>
          <Link className="serviceCard" to="/dashboard/downloads">Download Docs</Link>
        </div>
      )}
    </main>
  );
}
