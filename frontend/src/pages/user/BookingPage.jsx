import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { CreditCard, Calendar, Users, MessageSquare } from "lucide-react";

export default function BookingPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    checkIn: "", checkOut: "", guests: 1,
    paymentMethod: "credit_card",
    name: user?.name || "", email: user?.email || "", phone: "", specialRequests: "",
  });

  useEffect(() => {
    api.get(`/rooms/${roomId}`).then(res => setRoom(res.data.room)).catch(() => navigate("/rooms"));
  }, [roomId]);

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = nights * (room?.pricePerNight || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut) return toast.error("Please select dates");
    if (nights < 1) return toast.error("Check-out must be after check-in");
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        roomId, checkIn: form.checkIn, checkOut: form.checkOut,
        guests: form.guests, paymentMethod: form.paymentMethod,
        guestDetails: { name: form.name, email: form.email, phone: form.phone, specialRequests: form.specialRequests },
      });
      toast.success(`Booking confirmed! ID: ${res.data.booking.bookingId}`);
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally { setLoading(false); }
  };

  if (!room) return <div className="min-h-screen flex items-center justify-center" style={{background:"#0a0a0f"}}><div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <h1 className="section-title font-light mb-2">Complete Your Booking</h1>
        <div className="gold-divider mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dates & Guests */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Calendar size={18} className="text-gold-500" />Stay Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Check-In</label>
                    <input type="date" value={form.checkIn} min={new Date().toISOString().split("T")[0]}
                      onChange={e => setForm({...form, checkIn: e.target.value})} className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Check-Out</label>
                    <input type="date" value={form.checkOut} min={form.checkIn || new Date().toISOString().split("T")[0]}
                      onChange={e => setForm({...form, checkOut: e.target.value})} className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Guests</label>
                    <input type="number" min="1" max={room.capacity} value={form.guests}
                      onChange={e => setForm({...form, guests: e.target.value})} className="input-dark" />
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Users size={18} className="text-gold-500" />Guest Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-dark" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Special Requests</label>
                  <textarea value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})}
                    className="input-dark resize-none" rows="3" placeholder="Any special requests or preferences..." />
                </div>
              </div>

              {/* Payment */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2"><CreditCard size={18} className="text-gold-500" />Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[["credit_card", "Credit Card"], ["debit_card", "Debit Card"], ["upi", "UPI"], ["net_banking", "Net Banking"]].map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.paymentMethod === val ? "border-gold-500 bg-gold-500/5" : "border-white/10 hover:border-white/20"}`}>
                      <input type="radio" name="payment" value={val} checked={form.paymentMethod === val}
                        onChange={e => setForm({...form, paymentMethod: e.target.value})} className="accent-yellow-500" />
                      <span className="text-sm" style={{color:"rgba(232,224,208,0.8)"}}>{label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs mt-3 flex items-center gap-1.5" style={{color:"rgba(232,224,208,0.3)"}}>
                  🔒 This is a demo — no real payment is processed
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full py-4 rounded-xl text-sm font-semibold tracking-widest disabled:opacity-50">
                {loading ? "Processing..." : `Confirm Booking · ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="glass rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-xl mb-4">Booking Summary</h3>
              <img src={`https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80`} alt={room.name}
                className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
              <h4 className="font-semibold text-white mb-1">{room.name}</h4>
              <p className="text-xs mb-4" style={{color:"rgba(232,224,208,0.4)"}}>Room {room.roomNumber} · {room.type}</p>

              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between" style={{color:"rgba(232,224,208,0.6)"}}>
                  <span>Rate/night</span>
                  <span>₹{room.pricePerNight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{color:"rgba(232,224,208,0.6)"}}>
                  <span>Nights</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between font-semibold text-gold-400 text-base border-t border-white/10 pt-3 mt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
