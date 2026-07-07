import { Link } from "react-router-dom";
import { FaPhoneAlt, FaAmbulance, FaFireExtinguisher, FaShieldAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-12 mt-16">
      <div className="container grid md:grid-cols-4 gap-8 text-left">

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-bold text-xl tracking-wide">DigiGram</h3>
          <p className="text-sm mt-3 leading-relaxed">
            DigiGram is a digital governance platform for Kasbe Digraj Gram Panchayat, 
            ensuring transparent, fast and citizen-friendly services for rural development.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-primary transition" to="/about">About Panchayat</Link></li>
            <li><Link className="hover:text-primary transition" to="/services">Services</Link></li>
            <li><Link className="hover:text-primary transition" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-primary transition" to="/login">Citizen Login</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Contact Office</h3>
          <p className="text-sm leading-relaxed">
            🏢 Gram Panchayat Office<br />
            Kasbe Digraj, Sangli District<br />
            Maharashtra - 416 305<br /><br />
            📞 +91 98765 43210<br />
            ✉️ digigram@panchayat.gov.in
          </p>
        </div>

        {/* 🚨 EMERGENCY CONTACTS */}
        <div>
          <h3 className="text-red-400 font-semibold text-lg mb-3">Emergency Contacts</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaShieldAlt className="text-red-500" />
              Police Control: <strong>100</strong>
            </li>
            <li className="flex items-center gap-2">
              <FaAmbulance className="text-red-500" />
              Ambulance: <strong>108</strong>
            </li>
            <li className="flex items-center gap-2">
              <FaFireExtinguisher className="text-red-500" />
              Fire Brigade: <strong>101</strong>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-red-500" />
              Disaster Helpline: <strong>112</strong>
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="text-center text-gray-400 text-sm border-t border-gray-700 mt-10 pt-4">
        © {new Date().getFullYear()} DigiGram — Kasbe Digraj Gram Panchayat | All Rights Reserved
      </div>
    </footer>
  );
}
