import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/queries", form);
      toast.success("Your query has been submitted! We'll respond within 24 hours.");
      setForm({ ...form, subject: "", message: "" });
    } catch { toast.error("Failed to submit. Please try again."); } finally { setLoading(false); }
  };

  const contacts = [
    { icon: MapPin, label: "Address", value: "14 Royal Palace Road, Amer, Jaipur, Rajasthan 302028" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "hello@hotelaradhya.com" },
    { icon: Clock, label: "Check-in / Check-out", value: "Check-in: 2:00 PM | Check-out: 12:00 PM" },
  ];

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-3">Get In Touch</p>
          <h1 className="section-title font-light">Contact Us</h1>
          <div className="gold-divider mx-auto" />
          <p className="text-sm mt-4" style={{color:"rgba(232,224,208,0.4)"}}>We're here to make your stay extraordinary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-light mb-6">Reach Out To Us</h2>
            <div className="space-y-5 mb-10">
              {contacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 glass rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:"rgba(212,160,23,0.1)"}}>
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold-500/70 mb-0.5">{label}</p>
                    <p className="text-sm" style={{color:"rgba(232,224,208,0.7)"}}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chat Note */}
            <div className="glass rounded-xl p-5 border-gold-500/20">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle size={18} className="text-gold-500" />
                <h3 className="font-display text-lg">Live Chat Available</h3>
              </div>
              <p className="text-sm" style={{color:"rgba(232,224,208,0.5)"}}>
                For immediate assistance, call us directly at <span className="text-gold-400">+91 98765 43210</span>. 
                Our team is available 24/7 to assist you with reservations and inquiries.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-light mb-2">Send a Message</h2>
              <div className="gold-divider mb-6" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-dark" placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-dark" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-dark" placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="input-dark resize-none" rows="5" placeholder="Tell us about your inquiry..." required />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg text-sm disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
