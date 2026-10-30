import React from "react";
import { Link } from "react-router-dom";
import { Users, Maximize2, Wifi, Star } from "lucide-react";

const typeColors = {
  Standard: "text-blue-400 border-blue-400/40",
  Deluxe: "text-purple-400 border-purple-400/40",
  Suite: "text-gold-400 border-gold-400/40",
  Presidential: "text-rose-400 border-rose-400/40",
};

const roomImages = {
  Standard: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  Deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
  Suite: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
  Presidential: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
};

export default function RoomCard({ room }) {
  const img = room.images?.[0] || roomImages[room.type] || roomImages.Standard;

  return (
    <div className="card-room rounded-xl fade-up">
      <div className="relative h-52 overflow-hidden">
        <img src={img} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        <span className={`absolute top-3 left-3 badge-type ${typeColors[room.type] || "text-gold-400 border-gold-400/40"} bg-dark-900/80`}>
          {room.type}
        </span>
        <span className="absolute top-3 right-3 text-xs font-semibold text-gold-400 bg-dark-900/80 px-2 py-1 rounded">
          Room {room.roomNumber}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-white mb-1">{room.name}</h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{color:"rgba(232,224,208,0.5)"}}>{room.description}</p>

        <div className="flex items-center gap-4 mb-4 text-xs" style={{color:"rgba(232,224,208,0.5)"}}>
          <span className="flex items-center gap-1.5"><Users size={12} className="text-gold-500" />{room.capacity} Guests</span>
          <span className="flex items-center gap-1.5"><Maximize2 size={12} className="text-gold-500" />{room.size} sqft</span>
          <span className="flex items-center gap-1.5"><Wifi size={12} className="text-gold-500" />WiFi</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {room.amenities?.slice(0, 3).map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{background:"rgba(212,160,23,0.08)", color:"rgba(212,160,23,0.7)", border:"1px solid rgba(212,160,23,0.15)"}}>
              {a}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"rgba(255,255,255,0.05)", color:"rgba(232,224,208,0.4)"}}>+{room.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-0.5" style={{color:"rgba(232,224,208,0.4)"}}>Per Night</p>
            <p className="font-display text-2xl font-semibold text-gold-400">₹{room.pricePerNight.toLocaleString()}</p>
          </div>
          <Link to={`/rooms/${room._id}`} className="btn-gold px-5 py-2.5 text-xs rounded-lg">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
