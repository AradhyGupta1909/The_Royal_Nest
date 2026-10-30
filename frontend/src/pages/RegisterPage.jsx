import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Chrome, User, Shield } from "lucide-react";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", adminKey: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role, form.adminKey);
      toast.success(`Welcome to Hotel Aradhya, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12" style={{background:"#0a0a0f"}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-10" style={{background:"radial-gradient(circle, #d4a017, transparent)"}} />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full opacity-10" style={{background:"radial-gradient(circle, #d4a017, transparent)"}} />
      </div>

      <div className="w-full max-w-md mx-4 fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-gold-500 rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-gold-500" />
            </div>
            <span className="font-display text-xl tracking-widest text-gold-400">ARADHYA</span>
          </Link>
          <h1 className="section-title text-3xl font-light">Create Account</h1>
          <div className="gold-divider mx-auto mt-2" />
        </div>

        <div className="glass rounded-2xl p-8">
          {/* Role selector */}
          <div className="flex rounded-lg overflow-hidden mb-6 border border-gold-500/20">
            {[{ value: "user", label: "Guest", icon: User }, { value: "admin", label: "Admin", icon: Shield }].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                className={`flex-1 py-2.5 text-sm flex items-center justify-center gap-2 transition-all ${form.role === value ? "btn-gold" : "text-white/40 hover:text-white/60"}`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input-dark" placeholder="Your full name" required />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input-dark" placeholder="your@email.com" required />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="input-dark pr-11" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:"rgba(232,224,208,0.4)"}}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {form.role === "admin" && (
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Admin Secret Key</label>
                <input type="password" value={form.adminKey} onChange={e => setForm({...form, adminKey: e.target.value})}
                  className="input-dark" placeholder="Enter admin key" />
                <p className="text-xs mt-1" style={{color:"rgba(232,224,208,0.3)"}}>Contact the hotel manager for the admin key</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg text-sm mt-2 disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{background:"rgba(212,160,23,0.15)"}} />
            <span className="text-xs" style={{color:"rgba(232,224,208,0.3)"}}>or</span>
            <div className="flex-1 h-px" style={{background:"rgba(212,160,23,0.15)"}} />
          </div>

          <button onClick={loginWithGoogle} className="btn-outline-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-3">
            <Chrome size={16} />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-6" style={{color:"rgba(232,224,208,0.4)"}}>
            Already registered?{" "}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
