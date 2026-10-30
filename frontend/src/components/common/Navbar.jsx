import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-dark py-3 shadow-2xl" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 border border-gold-500 rotate-45 flex items-center justify-center">
            <div className="w-3 h-3 bg-gold-500 rotate-0" />
          </div>
          <span className="font-display text-xl tracking-widest text-gold-400">ARADHYA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
          <NavLink to="/rooms" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Rooms</NavLink>
          <NavLink to="/about" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Admin</NavLink>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                <div className="w-8 h-8 rounded-full bg-dark-600 border border-gold-500/30 flex items-center justify-center overflow-hidden">
                  {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={14} />}
                </div>
                <span className="font-body font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-12 w-48 glass-dark rounded-lg py-2 shadow-2xl">
                  <Link to="/my-bookings" onClick={() => setDropOpen(false)} className="block px-4 py-2 text-sm text-dark-100 hover:text-gold-400 hover:bg-white/5 transition-colors" style={{color:"rgba(232,224,208,0.8)"}}>My Bookings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:text-red-400 hover:bg-white/5 transition-colors" style={{color:"rgba(232,224,208,0.6)"}}>
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline-gold px-5 py-2 text-xs rounded">Sign In</Link>
              <Link to="/register" className="btn-gold px-5 py-2 text-xs rounded">Register</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gold-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark mt-2 mx-4 rounded-xl p-6 space-y-4">
          {[["Home", "/"], ["Rooms", "/rooms"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
            <Link key={href} to={href} onClick={() => setIsOpen(false)} className="block nav-link py-1">{label}</Link>
          ))}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setIsOpen(false)} className="block nav-link py-1">Admin</Link>}
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block nav-link py-1">My Bookings</Link>
              <button onClick={handleLogout} className="w-full btn-outline-gold px-4 py-2 text-xs rounded mt-2">Logout</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline-gold flex-1 text-center py-2 text-xs rounded">Sign In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn-gold flex-1 text-center py-2 text-xs rounded">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
