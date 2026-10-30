import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Users, Maximize2, CheckCircle2, ArrowLeft } from "lucide-react";

const roomImages = {
  Standard: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80"],
  Deluxe: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80"],
  Suite: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80", "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&q=80"],
  Presidential: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"],
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/rooms/${id}`).then(res => setRoom(res.data.room)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#0a0a0f"}}>
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!room) return <div className="min-h-screen flex items-center justify-center" style={{background:"#0a0a0f"}}><p className="text-gold-500">Room not found</p></div>;

  const images = room.images?.length ? room.images : (roomImages[room.type] || roomImages.Standard);

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f"}}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-8 hover:text-gold-400 transition-colors" style={{color:"rgba(232,224,208,0.5)"}}>
          <ArrowLeft size={16} />Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="rounded-xl overflow-hidden h-80 md:h-96 mb-3">
              <img src={images[activeImg]} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? "border-gold-500" : "border-transparent opacity-50"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="badge-type text-gold-400 border-gold-400/40">{room.type}</span>
              <span className="text-xs" style={{color:"rgba(232,224,208,0.4)"}}>Room {room.roomNumber} · Floor {room.floor}</span>
            </div>
            <h1 className="font-display text-4xl font-light mb-3">{room.name}</h1>
            <div className="gold-divider" />
            <p className="text-sm leading-relaxed my-5" style={{color:"rgba(232,224,208,0.6)"}}>{room.description}</p>

            <div className="flex gap-6 mb-6">
              <div className="text-center glass rounded-lg px-5 py-3">
                <Users size={18} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs" style={{color:"rgba(232,224,208,0.5)"}}>Up to {room.capacity} guests</p>
              </div>
              <div className="text-center glass rounded-lg px-5 py-3">
                <Maximize2 size={18} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs" style={{color:"rgba(232,224,208,0.5)"}}>{room.size} sqft</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gold-500 mb-3">Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm" style={{color:"rgba(232,224,208,0.7)"}}>
                    <CheckCircle2 size={14} className="text-gold-500 flex-shrink-0" />{a}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{color:"rgba(232,224,208,0.4)"}}>Price per night</p>
                <p className="font-display text-3xl font-semibold text-gold-400">₹{room.pricePerNight.toLocaleString()}</p>
              </div>
              {user ? (
                <Link to={`/booking/${room._id}`} className="btn-gold px-7 py-3 rounded-lg text-sm">Book Now</Link>
              ) : (
                <Link to="/login" state={{ from: `/booking/${room._id}` }} className="btn-gold px-7 py-3 rounded-lg text-sm">Login to Book</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
