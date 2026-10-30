import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#d4a017","#60a5fa","#a78bfa","#f472b6"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-4 py-3 text-xs">
        <p className="text-gold-400 font-semibold mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.name === "Revenue" ? `₹${p.value?.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/stats").then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Statistics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2,3].map(i => <div key={i} className="glass rounded-xl h-72 shimmer" />)}
      </div>
    </div>
  );

  // Build full 12-month data
  const monthlyData = MONTHS.map((month, i) => {
    const found = stats?.monthlyBookings?.find(m => m._id === i + 1);
    return { month, Bookings: found?.count || 0, Revenue: found?.revenue || 0 };
  });

  const pieData = stats?.roomTypeStats?.map(r => ({ name: r._id, value: r.count })) || [];

  const summaryCards = [
    { label: "Total Revenue (This Year)", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, sub: "All confirmed bookings" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, sub: "Excluding cancelled" },
    { label: "Registered Guests", value: stats?.totalUsers || 0, sub: "User accounts" },
    { label: "Active Stays", value: stats?.activeBookings || 0, sub: "Currently checked in" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Statistics</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>Analytics overview for {new Date().getFullYear()}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, sub }) => (
          <div key={label} className="glass rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(212,160,23,0.6)" }}>{label}</p>
            <p className="font-display text-2xl font-semibold text-gold-400 mb-1">{value}</p>
            <p className="text-xs" style={{ color: "rgba(232,224,208,0.3)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Bookings Bar Chart */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="font-display text-xl mb-1">Monthly Bookings — {new Date().getFullYear()}</h2>
        <p className="text-xs mb-6" style={{ color: "rgba(232,224,208,0.4)" }}>Number of confirmed bookings per month</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(232,224,208,0.4)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "rgba(232,224,208,0.4)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,160,23,0.05)" }} />
            <Bar dataKey="Bookings" fill="#d4a017" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-display text-xl mb-1">Monthly Revenue</h2>
          <p className="text-xs mb-6" style={{ color: "rgba(232,224,208,0.4)" }}>Revenue trend across the year</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(232,224,208,0.4)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(232,224,208,0.4)" }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Revenue" stroke="#d4a017" strokeWidth={2.5}
                dot={{ r: 4, fill: "#d4a017", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#f0d080" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Pie Chart */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-display text-xl mb-1">Room Type Usage</h2>
          <p className="text-xs mb-6" style={{ color: "rgba(232,224,208,0.4)" }}>Which room types are most booked</p>
          {pieData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-sm" style={{ color: "rgba(232,224,208,0.3)" }}>No data available yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} bookings`, ""]} contentStyle={{ background: "#1a1a26", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "12px", color: "#e8e0d0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span style={{ color: "rgba(232,224,208,0.7)" }}>{d.name}</span>
                    </div>
                    <span className="font-semibold text-gold-400">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
