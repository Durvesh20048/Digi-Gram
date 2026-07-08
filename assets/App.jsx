import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";

import CitizenDashboard from "./pages/Dashboard/CitizenDashboard";
import CitizenComplaint from "./pages/Dashboard/CitizenComplaint";
import CitizenComplaintList from "./pages/Dashboard/CitizenComplaintList";
import CitizenComplaintView from "./pages/Dashboard/CitizenComplaintView";
import CitizenProfile from "./pages/Dashboard/CitizenProfile";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import AdminComplaintList from "./pages/Admin/AdminComplaintList";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";

import ProtectedRoute from "./routes/ProtectedRoute";

import CitizenCertificates from "./pages/Dashboard/CitizenCertificates";
import CitizenCertificateList from "./pages/Dashboard/CitizenCertificateList";
import CitizenCertificateStatus from "./pages/Dashboard/CitizenCertificateStatus";

import AdminCertificateList from "./pages/Admin/AdminCertificateList";
import AdminCitizens from "./pages/Admin/AdminCitizens";

import CitizenSchemes from "./pages/Dashboard/CitizenSchemes";
import CitizenSchemeStatus from "./pages/Dashboard/CitizenSchemeStatus";

import AdminAddScheme from "./pages/Admin/AdminAddScheme";
import AdminSchemeApplications from "./pages/Admin/AdminSchemeApplications";

import AdminSiteContent from "./pages/Admin/AdminSiteContent";
import AdminNotices from "./pages/Admin/AdminNotices";
import VillageInfo from "./pages/Citizen/VillageInfo";
import AdminVillageInfo from "./pages/Admin/AdminVillageInfo";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= CITIZEN DASHBOARD ================= */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          } />

          {/* ✅ COMPLAINT ROUTES (FIXED) */}
          <Route path="/dashboard/complaints" element={
            <ProtectedRoute role="citizen">
              <CitizenComplaintList />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/complaints/new" element={
            <ProtectedRoute role="citizen">
              <CitizenComplaint />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/complaints/view/:id" element={
            <ProtectedRoute role="citizen">
              <CitizenComplaintView />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/profile" element={
            <ProtectedRoute role="citizen">
              <CitizenProfile />
            </ProtectedRoute>
          } />

          {/* ================= ADMIN ================= */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/complaints" element={
            <ProtectedRoute role="admin">
              <AdminComplaintList />
            </ProtectedRoute>
          } />

          <Route path="/admin/notices" element={<AdminNotices />} />
          <Route path="/admin/citizens" element={
            <ProtectedRoute role="admin">
              <AdminCitizens />
            </ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute role="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          {/* ================= CERTIFICATES ================= */}
          <Route path="/dashboard/certificates/apply" element={
            <ProtectedRoute role="citizen">
              <CitizenCertificates />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/certificates" element={
            <ProtectedRoute role="citizen">
              <CitizenCertificateList />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/certificates/status" element={
            <ProtectedRoute role="citizen">
              <CitizenCertificateStatus />
            </ProtectedRoute>
          } />

          <Route path="/admin/certificates" element={
            <ProtectedRoute role="admin">
              <AdminCertificateList />
            </ProtectedRoute>
          } />

          {/* ================= SCHEMES ================= */}
          <Route path="/dashboard/schemes" element={
            <ProtectedRoute role="citizen">
              <CitizenSchemes />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/schemes/status" element={
            <ProtectedRoute role="citizen">
              <CitizenSchemeStatus />
            </ProtectedRoute>
          } />

          <Route path="/admin/schemes/add" element={
            <ProtectedRoute role="admin">
              <AdminAddScheme />
            </ProtectedRoute>
          } />

          <Route path="/admin/schemes/applications" element={
            <ProtectedRoute role="admin">
              <AdminSchemeApplications />
            </ProtectedRoute>
          } />

          {/* ================= VILLAGE INFO ================= */}
          <Route path="/admin/village" element={
            <ProtectedRoute role="admin">
              <AdminVillageInfo />
            </ProtectedRoute>
          } />

          <Route path="/admin/site" element={
            <ProtectedRoute role="admin">
              <AdminSiteContent />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}
