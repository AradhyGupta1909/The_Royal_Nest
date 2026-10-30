import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import RoomCard from "../../components/user/RoomCard";
import api from "../../utils/api";
import { SlidersHorizontal } from "lucide-react";

const TYPES = ["All", "Standard", "Deluxe", "Suite", "Presidential"];

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "All", minPrice: "", maxPrice: "", capacity: "" });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.type !== "All") params.append("type", filter.type);
      if (filter.minPrice) params.append("minPrice", filter.minPrice);
      if (filter.maxPrice) params.append("maxPrice", filter.maxPrice);
      if (filter.capacity) params.append("capacity", filter.capacity);
      const res = await api.get(`/rooms?${params}`);
      setRooms(res.data.rooms);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, [filter.type]);

  const handleFilter = (e) => { e.preventDefault(); fetchRooms(); };

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10" style={{background:"radial-gradient(ellipse, #d4a017, transparent)"}} />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-3">Our Collection</p>
        <h1 className="section-title font-light">Rooms & Suites</h1>
        <div className="gold-divider mx-auto" />
        <p className="text-sm mt-4" style={{color:"rgba(232,224,208,0.4)"}}>Discover spaces crafted for comfort, elegance and unforgettable memories</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filter Bar */}
        <div className="glass rounded-xl p-5 mb-10">
          {/* Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter({...filter, type: t})}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter.type === t ? "btn-gold" : "btn-outline-gold"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Price / Capacity filter */}
          <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{color:"rgba(212,160,23,0.7)"}}>Min Price</label>
              <input type="number" value={filter.minPrice} onChange={e => setFilter({...filter, minPrice: e.target.value})}
                className="input-dark w-32" placeholder="₹ Min" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{color:"rgba(212,160,23,0.7)"}}>Max Price</label>
              <input type="number" value={filter.maxPrice} onChange={e => setFilter({...filter, maxPrice: e.target.value})}
                className="input-dark w-32" placeholder="₹ Max" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{color:"rgba(212,160,23,0.7)"}}>Guests</label>
              <input type="number" min="1" value={filter.capacity} onChange={e => setFilter({...filter, capacity: e.target.value})}
                className="input-dark w-24" placeholder="Min" />
            </div>
            <button type="submit" className="btn-gold px-5 py-[0.625rem] rounded-md text-xs flex items-center gap-2">
              <SlidersHorizontal size={14} />Apply
            </button>
            <button type="button" onClick={() => setFilter({ type: "All", minPrice: "", maxPrice: "", capacity: "" })}
              className="btn-outline-gold px-4 py-[0.625rem] rounded-md text-xs">Reset</button>
          </form>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="card-room rounded-xl h-80 shimmer" />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-gold-500/60">No rooms found</p>
            <p className="text-sm mt-2" style={{color:"rgba(232,224,208,0.3)"}}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{color:"rgba(232,224,208,0.4)"}}>{rooms.length} room{rooms.length !== 1 ? "s" : ""} available</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => <RoomCard key={room._id} room={room} />)}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
