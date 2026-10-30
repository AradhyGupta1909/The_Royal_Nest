import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

const EMPTY_ROOM = { name: "", type: "Standard", description: "", pricePerNight: "", capacity: "", size: "", roomNumber: "", floor: "", amenities: "" };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState(EMPTY_ROOM);
  const [saving, setSaving] = useState(false);

  const fetchRooms = () => {
    api.get("/rooms").then(res => setRooms(res.data.rooms)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const openAdd = () => { setEditRoom(null); setForm(EMPTY_ROOM); setModal(true); };
  const openEdit = (room) => {
    setEditRoom(room);
    setForm({ ...room, amenities: room.amenities?.join(", ") || "", pricePerNight: room.pricePerNight, capacity: room.capacity, size: room.size, floor: room.floor });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        size: Number(form.size),
        floor: Number(form.floor),
        amenities: form.amenities ? form.amenities.split(",").map(a => a.trim()).filter(Boolean) : [],
      };
      if (editRoom) {
        await api.put(`/rooms/${editRoom._id}`, payload);
        toast.success("Room updated!");
      } else {
        await api.post("/rooms", payload);
        toast.success("Room created!");
      }
      setModal(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save room");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted");
      fetchRooms();
    } catch { toast.error("Failed to delete"); }
  };

  const typeColor = { Standard: "text-blue-400", Deluxe: "text-purple-400", Suite: "text-gold-400", Presidential: "text-rose-400" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">Manage Rooms</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>{rooms.length} rooms in the system</p>
        </div>
        <button onClick={openAdd} className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Add Room
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="glass rounded-xl h-48 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room._id} className="glass rounded-xl p-5 hover:border-gold-500/25 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs uppercase tracking-widest font-medium ${typeColor[room.type]}`}>{room.type}</span>
                  <h3 className="font-display text-lg text-white mt-0.5">{room.name}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(212,160,23,0.1)", color: "rgba(212,160,23,0.7)" }}>
                  #{room.roomNumber}
                </span>
              </div>

              <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "rgba(232,224,208,0.5)" }}>{room.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
                {[["₹" + room.pricePerNight?.toLocaleString(), "/night"], [room.capacity + " guests", "capacity"], [room.size + " sqft", "size"]].map(([val, label]) => (
                  <div key={label} className="rounded-lg py-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="font-semibold text-white">{val}</p>
                    <p style={{ color: "rgba(232,224,208,0.35)" }}>{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(room)} className="flex-1 btn-outline-gold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(room._id, room.name)} className="px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-2xl glass-dark rounded-2xl p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{editRoom ? "Edit Room" : "Add New Room"}</h2>
              <button onClick={() => setModal(false)} style={{ color: "rgba(232,224,208,0.4)" }} className="hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Room Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-dark" required placeholder="e.g. Royal Suite" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-dark">
                    {["Standard", "Deluxe", "Suite", "Presidential"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Room Number</label>
                  <input value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} className="input-dark" required placeholder="e.g. 101" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Floor</label>
                  <input type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} className="input-dark" placeholder="1" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Price / Night (₹)</label>
                  <input type="number" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} className="input-dark" required placeholder="3500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Capacity (guests)</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="input-dark" required placeholder="2" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Size (sqft)</label>
                  <input type="number" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="input-dark" required placeholder="350" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-dark resize-none" rows="3" required placeholder="Room description..." />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,160,23,0.7)" }}>Amenities (comma separated)</label>
                <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} className="input-dark" placeholder="WiFi, AC, TV, Jacuzzi, Room Service" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline-gold flex-1 py-2.5 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={14} />{saving ? "Saving..." : editRoom ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
