import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, BedDouble, CalendarCheck, MessageSquare, BarChart2, LogOut, Menu, X, Hotel } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { to: "/admin/queries", label: "Queries", icon: MessageSquare },
  { to: "/admin/stats", label: "Statistics", icon: BarChart2 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-gold-500 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gold-500" />
          </div>
          <div>
            <p className="font-display text-sm tracking-widest text-gold-400">ARADHYA</p>
            <p className="text-xs" style={{color:"rgba(232,224,208,0.3)"}}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm text-gold-400" style={{background:"rgba(212,160,23,0.1)", border:"1px solid rgba(212,160,23,0.3)"}}>
            {user?.name?.[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs uppercase tracking-widest text-gold-500/60">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" : "hover:bg-white/5 border border-transparent"}`}
            style={({ isActive }) => ({ color: isActive ? undefined : "rgba(232,224,208,0.6)" })}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent"
          style={{color:"rgba(232,224,208,0.4)"}}>
          <LogOut size={16} />Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{background:"#0a0a0f"}}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen" style={{background:"#12121a", borderRight:"1px solid rgba(212,160,23,0.1)"}}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 z-10" style={{background:"#12121a", borderRight:"1px solid rgba(212,160,23,0.1)"}}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gold-400"><X size={20} /></button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-40" style={{background:"rgba(18,18,26,0.95)", borderBottom:"1px solid rgba(212,160,23,0.1)"}}>
          <button onClick={() => setSidebarOpen(true)} className="text-gold-400"><Menu size={22} /></button>
          <span className="font-display text-lg tracking-widest text-gold-400">ARADHYA</span>
          <div className="w-6" />
        </div>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
