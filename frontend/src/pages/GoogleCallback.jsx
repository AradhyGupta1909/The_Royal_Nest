import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function GoogleCallback() {
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");
    if (error || !token) {
      toast.error("Google login failed");
      navigate("/login");
      return;
    }
    handleGoogleCallback(token).then((user) => {
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    }).catch(() => {
      toast.error("Authentication failed");
      navigate("/login");
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#0a0a0f"}}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gold-400 font-display text-xl">Authenticating...</p>
      </div>
    </div>
  );
}
