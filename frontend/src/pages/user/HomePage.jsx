import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../utils/api";
import RoomCard from "../../components/user/RoomCard";
import { Search, Star, Coffee, Wifi, Car, Dumbbell, MapPin, Award } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [suggest, setSuggest] = useState({ guests: "", budget: "", preference: "any" });
  const [suggested, setSuggested] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSuggest = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (suggest.guests) params.append("guests", suggest.guests);
      if (suggest.budget) params.append("budget", suggest.budget);
      if (suggest.preference !== "any") params.append("preference", suggest.preference);
      const res = await api.get(`/rooms/suggest?${params}`);
      setSuggested(res.data.rooms);
      if (res.data.rooms.length === 0) {
        import("react-hot-toast").then(m => m.default.error("No rooms match your criteria"));
      }
    } catch {
      import("react-hot-toast").then(m => m.default.error("Something went wrong"));
    } finally {
      setSearching(false);
    }
  };

  const amenities = [
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Coffee, label: "Fine Dining" },
    { icon: Car, label: "Valet Parking" },
    { icon: Dumbbell, label: "Luxury Spa & Gym" },
    { icon: Star, label: "Concierge 24/7" },
    { icon: Award, label: "Award Winning" },
  ];

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90" alt="Hotel" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,1) 100%)"}} />
        </div>

        <div className="relative text-center px-6 max-w-4xl mx-auto fade-up">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-500 mb-6">Welcome to</p>
          <h1 className="font-display font-light leading-none mb-4" style={{fontSize:"clamp(3rem,10vw,7rem)"}}>
            Hotel <span className="gold-text italic">Aradhya</span>
          </h1>
          <p className="text-base md:text-lg font-light mb-10 max-w-xl mx-auto" style={{color:"rgba(232,224,208,0.6)"}}>
            Where timeless elegance meets modern luxury in the heart of Jaipur's royal heritage
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/rooms" className="btn-gold px-8 py-3.5 rounded-lg text-sm tracking-widest">Explore Rooms</Link>
            <Link to="/about" className="btn-outline-gold px-8 py-3.5 rounded-lg text-sm tracking-widest">Our Story</Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-16">
            {[["500+", "Happy Guests"], ["15+", "Room Types"], ["4.9★", "Rating"], ["24/7", "Service"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-semibold text-gold-400">{num}</p>
                <p className="text-xs mt-1" style={{color:"rgba(232,224,208,0.4)"}}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-gold-500/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── ROOM SUGGESTION FORM ────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl font-light text-center mb-2">Find Your Perfect Room</h2>
          <p className="text-xs text-center mb-6" style={{color:"rgba(232,224,208,0.4)"}}>Tell us your needs and we'll suggest the ideal suite</p>

          <form onSubmit={handleSuggest} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Guests</label>
              <input type="number" min="1" max="10" value={suggest.guests} onChange={e => setSuggest({...suggest, guests: e.target.value})}
                className="input-dark" placeholder="No. of guests" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Max Budget / Night</label>
              <input type="number" value={suggest.budget} onChange={e => setSuggest({...suggest, budget: e.target.value})}
                className="input-dark" placeholder="₹ Per night" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"rgba(212,160,23,0.7)"}}>Preference</label>
              <select value={suggest.preference} onChange={e => setSuggest({...suggest, preference: e.target.value})} className="input-dark">
                <option value="any">Any</option>
                <option value="budget">Budget-friendly</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={searching} className="btn-gold w-full py-[0.625rem] rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                <Search size={15} />{searching ? "Searching..." : "Suggest Rooms"}
              </button>
            </div>
          </form>

          {suggested.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-xl mb-4 text-gold-400">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {suggested.map(room => <RoomCard key={room._id} room={room} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── AMENITIES ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-3">World-Class</p>
          <h2 className="section-title">Unmatched Amenities</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {amenities.map(({ icon: Icon, label }) => (
            <div key={label} className="glass rounded-xl p-6 text-center hover:border-gold-500/30 transition-all group">
              <Icon size={26} className="mx-auto mb-3 text-gold-500 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium" style={{color:"rgba(232,224,208,0.7)"}}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOCATION ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-3">Our Location</p>
            <h2 className="section-title text-3xl font-light mb-4">Heart of Royal Jaipur</h2>
            <div className="gold-divider" />
            <p className="text-sm leading-relaxed my-5" style={{color:"rgba(232,224,208,0.5)"}}>
              Nestled near the historic Amer Fort, Hotel Aradhya places you within moments of Jaipur's most iconic landmarks. 
              The Pink City's heritage bazaars and palaces are at your doorstep.
            </p>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{color:"rgba(232,224,208,0.6)"}}>14 Royal Palace Road, Amer, Jaipur, Rajasthan 302028</p>
            </div>
            <Link to="/contact" className="btn-outline-gold px-6 py-2.5 rounded-lg text-xs mt-8 inline-block w-fit">Get Directions</Link>
          </div>
          <div className="relative min-h-64 md:min-h-0">
            <img src="https://images.unsplash.com/photo-1477587458883-47145ed86191?w=800&q=80" alt="Jaipur" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-transparent" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
