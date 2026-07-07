import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert("Message submitted successfully ✅");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="container py-14 space-y-14">

      {/* ===== HEADER ===== */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-ink">Contact Gram Panchayat</h1>
        <p className="text-sub mt-2">
          Get in touch with Kasbe Digraj Gram Panchayat Administration
        </p>
      </header>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
          <FaPhoneAlt className="text-3xl text-primary mx-auto mb-3" />
          <h3 className="font-semibold">Phone</h3>
          <p className="text-sub">+91 98765 43210</p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
          <FaEnvelope className="text-3xl text-primary mx-auto mb-3" />
          <h3 className="font-semibold">Email</h3>
          <p className="text-sub">digigram@gmail.com</p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
          <FaMapMarkerAlt className="text-3xl text-primary mx-auto mb-3" />
          <h3 className="font-semibold">Office Address</h3>
          <p className="text-sub">
            Kasbe Digraj Gram Panchayat Office, <br />
            Taluka Miraj, Sangli, Maharashtra
          </p>
        </div>

      </section>

      {/* ===== MAP + FORM SECTION ===== */}
      <section className="grid md:grid-cols-2 gap-10">

        {/* ✅ MAP */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <iframe
            title="Panchayat Location"
            src="https://maps.google.com/maps?q=Kasbe%20Digraj%20Sangli&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[350px]"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* ✅ CONTACT FORM */}
        <div className="bg-white shadow-xl rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Type your message..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
            >
              Send Message
            </button>

          </form>
        </div>

      </section>

    </main>
  );
}
