import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Users, CalendarCheck, DollarSign, BedDouble, TrendingUp, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/bookings/stats"),
      api.get("/bookings"),
    ]).then(([statsRes, bookingsRes]) => {
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-blue-400", bg: "rgba(96,165,250,0.1)" },
    { label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-gold-400", bg: "rgba(212,160,23,0.1)" },
    { label: "Total Guests", value: stats.totalUsers, icon: Users, color: "text-green-400", bg: "rgba(74,222,128,0.1)" },
    { label: "Active Stays", value: stats.activeBookings || 0, icon: BedDouble, color: "text-purple-400", bg: "rgba(192,132,252,0.1)" },
  ] : [];

  const statusClass = { confirmed: "status-confirmed", cancelled: "status-cancelled", pending: "status-pending", completed: "status-completed" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>Welcome back, Admin. Here's what's happening.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="glass rounded-xl h-28 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(232,224,208,0.4)" }}>{label}</p>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className={`font-display text-2xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
            View All <TrendingUp size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 shimmer rounded-lg" />)}</div>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "rgba(232,224,208,0.3)" }}>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Booking ID", "Guest", "Room", "Check-In", "Check-Out", "Total", "Status"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs uppercase tracking-widest font-medium" style={{ color: "rgba(212,160,23,0.6)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 text-xs font-mono text-gold-400/70">{b.bookingId}</td>
                    <td className="py-3" style={{ color: "rgba(232,224,208,0.8)" }}>{b.user?.name || "—"}</td>
                    <td className="py-3" style={{ color: "rgba(232,224,208,0.6)" }}>{b.room?.name || "—"}</td>
                    <td className="py-3 text-xs" style={{ color: "rgba(232,224,208,0.5)" }}>{new Date(b.checkIn).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 text-xs" style={{ color: "rgba(232,224,208,0.5)" }}>{new Date(b.checkOut).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 text-gold-400 font-medium">₹{b.totalPrice?.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`badge-type text-xs px-2 py-0.5 rounded ${statusClass[b.status] || ""}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Manage Rooms", desc: "Add, edit or remove rooms", to: "/admin/rooms", icon: BedDouble },
          { label: "View Queries", desc: "Respond to guest inquiries", to: "/admin/queries", icon: Clock },
          { label: "Statistics", desc: "Revenue & booking analytics", to: "/admin/stats", icon: TrendingUp },
        ].map(({ label, desc, to, icon: Icon }) => (
          <Link key={to} to={to} className="glass rounded-xl p-5 hover:border-gold-500/30 transition-all group">
            <Icon size={20} className="text-gold-500 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-sm text-white mb-1">{label}</p>
            <p className="text-xs" style={{ color: "rgba(232,224,208,0.4)" }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
