import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Calendar, Users, Hash, XCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch { toast.error("Failed to load bookings"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch { toast.error("Failed to cancel"); }
  };

  const statusClass = { confirmed: "status-confirmed", cancelled: "status-cancelled", pending: "status-pending", completed: "status-completed" };

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <h1 className="section-title font-light mb-2">My Bookings</h1>
        <div className="gold-divider mb-10" />

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass rounded-xl h-32 shimmer" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 glass rounded-2xl">
            <p className="font-display text-3xl text-gold-500/50 mb-3">No Bookings Yet</p>
            <p className="text-sm mb-6" style={{color:"rgba(232,224,208,0.3)"}}>Your luxury experience awaits</p>
            <Link to="/rooms" className="btn-gold px-8 py-3 rounded-lg text-sm">Explore Rooms</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="glass rounded-xl p-6 hover:border-gold-500/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl">{b.room?.name || "Room"}</h3>
                      <span className={`badge-type text-xs px-2 py-0.5 rounded ${statusClass[b.status]}`}>{b.status}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm" style={{color:"rgba(232,224,208,0.5)"}}>
                      <span className="flex items-center gap-1.5">
                        <Hash size={13} className="text-gold-500" />{b.bookingId}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gold-500" />
                        {format(new Date(b.checkIn), "dd MMM yyyy")} → {format(new Date(b.checkOut), "dd MMM yyyy")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={13} className="text-gold-500" />{b.guests} guest{b.guests > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs mt-2" style={{color:"rgba(232,224,208,0.3)"}}>
                      <span>Booked on {format(new Date(b.createdAt), "dd MMM yyyy, hh:mm a")}</span>
                      <span>· {b.room?.type}</span>
                      <span>· Room {b.room?.roomNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs mb-0.5" style={{color:"rgba(232,224,208,0.3)"}}>Total Paid</p>
                      <p className="font-display text-xl text-gold-400">₹{b.totalPrice?.toLocaleString()}</p>
                    </div>
                    {b.status === "confirmed" && (
                      <button onClick={() => cancelBooking(b._id)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-2 rounded-lg hover:bg-red-400/5 transition-all">
                        <XCircle size={13} />Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
