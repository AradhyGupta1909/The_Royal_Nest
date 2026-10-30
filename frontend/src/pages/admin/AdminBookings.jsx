import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { format } from "date-fns";
import { Search, Filter } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    api.get("/bookings").then(res => {
      setBookings(res.data.bookings);
      setFiltered(res.data.bookings);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...bookings];
    if (statusFilter !== "all") data = data.filter(b => b.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(b =>
        b.bookingId?.toLowerCase().includes(q) ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.room?.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, bookings]);

  const statusClass = { confirmed: "status-confirmed", cancelled: "status-cancelled", pending: "status-pending", completed: "status-completed" };
  const statuses = ["all", "confirmed", "cancelled", "pending", "completed"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">All Bookings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(212,160,23,0.5)" }} />
          <input
            type="text" placeholder="Search by guest, booking ID, room..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-dark pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${statusFilter === s ? "btn-gold" : "btn-outline-gold"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-12 shimmer rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-gold-500/40">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "rgba(212,160,23,0.05)" }}>
                <tr>
                  {["Booking ID", "Guest", "Room", "Check-In", "Check-Out", "Guests", "Total", "Payment", "Status", "Booked On"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest font-medium whitespace-nowrap"
                      style={{ color: "rgba(212,160,23,0.6)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id} className="border-t border-white/5 hover:bg-white/2 transition-colors"
                    style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: "rgba(212,160,23,0.7)" }}>{b.bookingId}</td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{b.user?.name || "—"}</p>
                      <p className="text-xs" style={{ color: "rgba(232,224,208,0.35)" }}>{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs" style={{ color: "rgba(232,224,208,0.8)" }}>{b.room?.name || "—"}</p>
                      <p className="text-xs" style={{ color: "rgba(232,224,208,0.35)" }}>{b.room?.type} · #{b.room?.roomNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(232,224,208,0.6)" }}>
                      {b.checkIn ? format(new Date(b.checkIn), "dd MMM yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(232,224,208,0.6)" }}>
                      {b.checkOut ? format(new Date(b.checkOut), "dd MMM yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(232,224,208,0.6)" }}>{b.guests}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#d4a017" }}>
                      ₹{b.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs capitalize" style={{ color: "rgba(232,224,208,0.5)" }}>
                      {b.paymentMethod?.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-type text-xs px-2 py-0.5 rounded ${statusClass[b.status] || ""}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(232,224,208,0.35)" }}>
                      {b.createdAt ? format(new Date(b.createdAt), "dd MMM yy") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
