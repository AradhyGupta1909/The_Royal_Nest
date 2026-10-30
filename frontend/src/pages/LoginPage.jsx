import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Chrome } from "lucide-react";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"#0a0a0f"}}>
      {/* BG decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-10" style={{background:"radial-gradient(circle, #d4a017, transparent)"}} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10" style={{background:"radial-gradient(circle, #d4a017, transparent)"}} />
      </div>

      <div className="w-full max-w-md mx-4 fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-gold-500 rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-gold-500" />
            </div>
            <span className="font-display text-xl tracking-widest text-gold-400">ARADHYA</span>
          </Link>
          <h1 className="section-title text-3xl font-light">Welcome Back</h1>
          <div className="gold-divider mx-auto mt-2" />
          <p className="text-sm mt-3" style={{color:"rgba(232,224,208,0.4)"}}>Sign in to continue your luxury experience</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input-dark" placeholder="your@email.com" required />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="input-dark pr-11" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:"rgba(232,224,208,0.4)"}}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg text-sm mt-2 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
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
            New to Aradhya?{" "}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
