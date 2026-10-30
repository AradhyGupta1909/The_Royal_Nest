import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { MessageSquare, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Send } from "lucide-react";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = () => {
    api.get("/queries").then(res => setQueries(res.data.queries)).finally(() => setLoading(false));
  };

  const updateQuery = async (id, status, adminReply) => {
    try {
      await api.put(`/queries/${id}`, { status, adminReply });
      toast.success("Query updated");
      fetchQueries();
      setExpanded(null);
    } catch { toast.error("Failed to update"); }
  };

  const statusIcon = { open: AlertCircle, "in-progress": Clock, resolved: CheckCircle2 };
  const statusColor = { open: "text-red-400", "in-progress": "text-yellow-400", resolved: "text-green-400" };
  const statusBg = { open: "rgba(248,113,113,0.1)", "in-progress": "rgba(251,191,36,0.1)", resolved: "rgba(74,222,128,0.1)" };
  const statusBorder = { open: "rgba(248,113,113,0.3)", "in-progress": "rgba(251,191,36,0.3)", resolved: "rgba(74,222,128,0.3)" };

  const filtered = statusFilter === "all" ? queries : queries.filter(q => q.status === statusFilter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Guest Queries</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>
          {queries.filter(q => q.status === "open").length} open · {queries.length} total
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Open", count: queries.filter(q => q.status === "open").length, color: "text-red-400", bg: "rgba(248,113,113,0.08)" },
          { label: "In Progress", count: queries.filter(q => q.status === "in-progress").length, color: "text-yellow-400", bg: "rgba(251,191,36,0.08)" },
          { label: "Resolved", count: queries.filter(q => q.status === "resolved").length, color: "text-green-400", bg: "rgba(74,222,128,0.08)" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="glass rounded-xl p-4 text-center" style={{ background: bg }}>
            <p className={`font-display text-2xl font-semibold ${color}`}>{count}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(232,224,208,0.4)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "open", "in-progress", "resolved"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs capitalize transition-all ${statusFilter === s ? "btn-gold" : "btn-outline-gold"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Queries List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass rounded-xl h-20 shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl">
          <MessageSquare size={40} className="mx-auto mb-3" style={{ color: "rgba(212,160,23,0.3)" }} />
          <p className="font-display text-xl" style={{ color: "rgba(232,224,208,0.3)" }}>No queries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => {
            const Icon = statusIcon[q.status];
            const isOpen = expanded === q._id;
            return (
              <div key={q._id} className="glass rounded-xl overflow-hidden transition-all">
                {/* Header */}
                <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded(isOpen ? null : q._id)}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: statusBg[q.status], border: `1px solid ${statusBorder[q.status]}` }}>
                    <Icon size={15} className={statusColor[q.status]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="font-medium text-sm text-white">{q.subject}</p>
                      <span className="text-xs px-2 py-0.5 rounded border capitalize"
                        style={{ color: statusColor[q.status]?.replace("text-", ""), background: statusBg[q.status], borderColor: statusBorder[q.status] }}>
                        {q.status}
                      </span>
                      {q.room && (
                        <span className="text-xs px-2 py-0.5 rounded border" style={{ color: "rgba(212,160,23,0.7)", borderColor: "rgba(212,160,23,0.2)", background: "rgba(212,160,23,0.05)" }}>
                          Room: {q.room.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: "rgba(232,224,208,0.4)" }}>
                      <span>{q.name} · {q.email}</span>
                      {q.phone && <span>📞 {q.phone}</span>}
                      <span>🕐 {format(new Date(q.createdAt), "dd MMM yyyy, hh:mm a")}</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} style={{ color: "rgba(212,160,23,0.5)" }} /> : <ChevronDown size={16} style={{ color: "rgba(212,160,23,0.5)" }} />}
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    <div className="glass rounded-lg p-4 mb-4">
                      <p className="text-xs uppercase tracking-widest text-gold-500/60 mb-2">Guest Message</p>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,208,0.7)" }}>{q.message}</p>
                    </div>

                    {q.adminReply && (
                      <div className="rounded-lg p-4 mb-4" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                        <p className="text-xs uppercase tracking-widest text-green-400/60 mb-2">Your Reply</p>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,208,0.7)" }}>{q.adminReply}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <textarea
                        value={replyText[q._id] || ""}
                        onChange={e => setReplyText({ ...replyText, [q._id]: e.target.value })}
                        className="input-dark resize-none w-full" rows="3"
                        placeholder="Type your reply to the guest..." />

                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => updateQuery(q._id, "in-progress", replyText[q._id])}
                          className="btn-outline-gold px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                          <Clock size={13} /> Mark In Progress
                        </button>
                        <button onClick={() => updateQuery(q._id, "resolved", replyText[q._id])}
                          className="btn-gold px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                          <Send size={13} /> Reply & Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
