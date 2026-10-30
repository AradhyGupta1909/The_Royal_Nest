import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";
import { Award, Heart, Star, Globe } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Heart, title: "Heartfelt Hospitality", desc: "Every guest is family. We craft experiences with warmth and genuine care." },
    { icon: Star, title: "Uncompromised Luxury", desc: "From thread count to turndown service, excellence lives in every detail." },
    { icon: Globe, title: "Cultural Heritage", desc: "Rooted in Jaipur's royal legacy, we blend tradition with modern comfort." },
    { icon: Award, title: "Award-Winning Service", desc: "Recognized as Rajasthan's finest boutique luxury hotel for 5 consecutive years." },
  ];

  const team = [
    { name: "Aradhy", role: "Founder & Creator", note: "Visionary behind Hotel Aradhya's concept and digital platform" },
    { name: "Priya Sharma", role: "General Manager", note: "20 years of luxury hospitality across India and Europe" },
    { name: "Rahul Verma", role: "Executive Chef", note: "Michelin-trained, specializing in Rajasthani and continental cuisine" },
  ];

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />

      {/* Hero */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Hotel" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(10,10,15,0.5), rgba(10,10,15,1))"}} />
        </div>
        <div className="relative text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-3">Our Story</p>
          <h1 className="section-title font-light">About Hotel Aradhya</h1>
          <div className="gold-divider mx-auto" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-20">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-4">Est. 2018</p>
            <h2 className="section-title text-3xl font-light mb-4">A Legacy of Elegance</h2>
            <div className="gold-divider mb-6" />
            <div className="space-y-4 text-sm leading-relaxed" style={{color:"rgba(232,224,208,0.6)"}}>
              <p>Hotel Aradhya was born from a dream — to create a sanctuary where the magnificence of Rajasthan's royal heritage meets the expectations of the modern luxury traveler.</p>
              <p>Named after the Sanskrit word for "worship," every corner of Hotel Aradhya is a tribute to the art of refined living. Our architecture draws from the pink sandstone palaces of Jaipur, while our interiors balance classical opulence with contemporary minimalism.</p>
              <p>We are proud to be 100% designed, developed, and managed by Indian talent, with our digital platform built by <span className="text-gold-400 font-semibold">Aradhy</span> as a labor of love for hospitality and technology alike.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=400&q=80" alt="" className="rounded-xl h-48 w-full object-cover opacity-80" />
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80" alt="" className="rounded-xl h-48 w-full object-cover opacity-80 mt-8" />
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80" alt="" className="rounded-xl h-48 w-full object-cover opacity-80 -mt-8" />
            <img src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80" alt="" className="rounded-xl h-48 w-full object-cover opacity-80" />
          </div>
        </div>

        {/* Values */}
        <div className="py-16 border-t border-gold-500/10">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl font-light">Our Values</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-xl p-6 text-center hover:border-gold-500/30 transition-all">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:"rgba(212,160,23,0.1)"}}>
                  <Icon size={22} className="text-gold-500" />
                </div>
                <h3 className="font-display text-lg mb-2">{title}</h3>
                <p className="text-xs leading-relaxed" style={{color:"rgba(232,224,208,0.5)"}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="py-12 border-t border-gold-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["6+", "Luxury Rooms"], ["5000+", "Happy Guests"], ["5★", "Average Rating"], ["2018", "Founded"]].map(([num, label]) => (
              <div key={label} className="glass rounded-xl p-6">
                <p className="font-display text-4xl font-light text-gold-400 mb-2">{num}</p>
                <p className="text-xs uppercase tracking-widest" style={{color:"rgba(232,224,208,0.4)"}}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="py-16 border-t border-gold-500/10">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl font-light">The Team</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(({ name, role, note }) => (
              <div key={name} className="glass rounded-xl p-7 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-display text-2xl text-gold-400" style={{background:"rgba(212,160,23,0.1)", border:"1px solid rgba(212,160,23,0.3)"}}>
                  {name[0]}
                </div>
                <h3 className="font-display text-xl mb-1">{name}</h3>
                <p className="text-xs text-gold-500 uppercase tracking-widest mb-3">{role}</p>
                <p className="text-xs leading-relaxed" style={{color:"rgba(232,224,208,0.5)"}}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 glass rounded-2xl">
          <h2 className="section-title text-3xl font-light mb-3">Ready to Experience Aradhya?</h2>
          <p className="text-sm mb-8" style={{color:"rgba(232,224,208,0.4)"}}>Book your stay and become part of our story</p>
          <div className="flex gap-4 justify-center">
            <Link to="/rooms" className="btn-gold px-8 py-3 rounded-lg text-sm">View Rooms</Link>
            <Link to="/contact" className="btn-outline-gold px-8 py-3 rounded-lg text-sm">Contact Us</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
