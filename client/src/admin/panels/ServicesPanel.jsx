import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiDatabase,
} from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import API from "../../utils/api";

const THEMES = [
  "indigo",
  "violet",
  "cyan",
  "pink",
  "emerald",
  "orange",
  "rose",
  "amber",
];
const EMOJIS = [
  "🌐",
  "⚡",
  "📱",
  "🎨",
  "🗄️",
  "🚀",
  "🔐",
  "📊",
  "⚙️",
  "💡",
  "🛡️",
  "🤖",
];
const EMPTY = {
  title: "",
  description: "",
  icon: "⚡",
  featured: false,
  tags: [],
  colorTheme: "indigo",
  order: 0,
};

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState(service || EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t))
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-dark border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold">
            {service ? "Edit Service" : "New Service"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Web Development"
              className="glass-input w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              placeholder="Describe this service…"
              className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
            />
          </div>

          {/* Emoji picker */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
              Icon
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm((f) => ({ ...f, icon: e }))}
                  className={`w-9 h-9 rounded-xl text-lg transition-all ${form.icon === e ? "bg-indigo-500/25 border border-indigo-500/40" : "glass border border-white/8 hover:bg-white/8"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, colorTheme: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${form.colorTheme === t ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/40" : "text-gray-500 glass border border-white/8 hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="React, Node.js…"
                className="glass-input flex-1 px-3 py-2 rounded-xl text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/25 transition-all text-sm"
              >
                <FiPlus size={13} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                >
                  {tag}{" "}
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        tags: f.tags.filter((t) => t !== tag),
                      }))
                    }
                    className="text-indigo-400/60 hover:text-red-400"
                  >
                    <FiX size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: +e.target.value }))
                }
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Featured (shows large)
              </label>
              <button
                onClick={() =>
                  setForm((f) => ({ ...f, featured: !f.featured }))
                }
                className={`flex items-center gap-2 px-4 py-3 rounded-xl glass border transition-all text-sm w-full ${form.featured ? "border-indigo-500/25 text-indigo-300 bg-indigo-500/8" : "border-white/10 text-gray-500"}`}
              >
                <HiBadgeCheck
                  size={15}
                  className={form.featured ? "text-indigo-400" : ""}
                />
                {form.featured ? "Featured" : "Regular"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSave size={14} />
              )}
              {service ? "Update Service" : "Create Service"}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm text-gray-400 glass border border-white/10 hover:text-white"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPanel({ showToast }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [modal, setModal] = useState(null); // null | 'new' | serviceObj

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/services");
      setServices(data);
    } catch {
      showToast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (form) => {
    try {
      if (modal?._id) {
        const { data } = await API.put(`/services/${modal._id}`, form);
        setServices((s) => s.map((x) => (x._id === modal._id ? data : x)));
        showToast("Service updated!");
      } else {
        const { data } = await API.post("/services", form);
        setServices((s) => [...s, data]);
        showToast("Service created!");
      }
      setModal(null);
    } catch {
      showToast("Failed to save service", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      setServices((s) => s.filter((x) => x._id !== id));
      showToast("Service deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("Replace all services with sample data?")) return;
    setSeeding(true);
    try {
      const { data } = await API.post("/services/seed");
      setServices(data.data);
      showToast(data.message);
    } catch {
      showToast("Seeding failed", "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      {modal !== null && (
        <ServiceModal
          service={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold">Services</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Manage the services you offer
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-amber-400 glass border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50">
            {seeding ? <div className="w-3 h-3 border border-t-amber-400 border-amber-400/30 rounded-full animate-spin"/> : <FiDatabase size={12}/>} Seed Sample
          </button> */}
          <button
            onClick={() => setModal("new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transition-all"
          >
            <FiPlus size={13} /> Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-36 glass border border-white/8 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚡</div>
          <p className="text-gray-400 mb-4">No services yet.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setModal("new")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              + Add Service
            </button>
            {/* <button
              onClick={handleSeed}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-400 glass border border-amber-500/20"
            >
              Seed Sample
            </button> */}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div
              key={svc._id}
              className="glass border border-white/8 rounded-2xl p-5 group hover:border-white/15 transition-all relative"
            >
              {svc.featured && (
                <span className="absolute top-3 right-3 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <div className="text-3xl mb-3">{svc.icon}</div>
              <h4 className="text-white font-semibold text-sm mb-1.5 line-clamp-1">
                {svc.title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                {svc.description}
              </p>
              {svc.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {svc.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/8"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-gray-600">
                <span className="capitalize">
                  {svc.colorTheme} theme · Order {svc.order}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal(svc)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(svc._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
