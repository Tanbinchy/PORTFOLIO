import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiDatabase,
} from "react-icons/fi";
import { HiStar } from "react-icons/hi";
import API from "../../utils/api";

const EMPTY = {
  name: "",
  role: "",
  company: "",
  image: "",
  rating: 5,
  review: "",
  metrics: [],
  order: 0,
};

function TestimonialModal({ testimonial, onClose, onSave }) {
  const [form, setForm] = useState(testimonial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const addMetric = () =>
    setForm((f) => ({
      ...f,
      metrics: [...f.metrics, { label: "", value: "" }],
    }));
  const updateMetric = (i, field, val) =>
    setForm((f) => ({
      ...f,
      metrics: f.metrics.map((m, idx) =>
        idx === i ? { ...m, [field]: val } : m,
      ),
    }));
  const removeMetric = (i) =>
    setForm((f) => ({
      ...f,
      metrics: f.metrics.filter((_, idx) => idx !== i),
    }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-dark border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold">
            {testimonial ? "Edit Testimonial" : "New Testimonial"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Client Name *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Sarah Johnson"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Role / Title
              </label>
              <input
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                placeholder="CTO"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Company
              </label>
              <input
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="TechCorp Inc."
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Photo URL
              </label>
              <input
                value={form.image}
                onChange={(e) => {
                  setForm((f) => ({ ...f, image: e.target.value }));
                  setImgError(false);
                }}
                placeholder="https://images.unsplash.com/…"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden bg-white/4 border border-white/6">
                {form.image && !imgError ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                    👤
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Rating (1–5)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <HiStar
                      size={24}
                      className={
                        star <= form.rating
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Display Order
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
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-1.5">
                Review *
              </label>
              <textarea
                value={form.review}
                onChange={(e) =>
                  setForm((f) => ({ ...f, review: e.target.value }))
                }
                rows={6}
                placeholder="Write the client's testimonial here…"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider">
                  Metrics (optional)
                </label>
                <button
                  onClick={addMetric}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <FiPlus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.metrics.map((m, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={m.label}
                      onChange={(e) => updateMetric(i, "label", e.target.value)}
                      placeholder="Label"
                      className="glass-input flex-1 px-3 py-2 rounded-lg text-xs"
                    />
                    <input
                      value={m.value}
                      onChange={(e) => updateMetric(i, "value", e.target.value)}
                      placeholder="Value"
                      className="glass-input flex-1 px-3 py-2 rounded-lg text-xs"
                    />
                    <button
                      onClick={() => removeMetric(i)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-[10px] mt-2">
                E.g. "Timeline" → "On Time", "Quality" → "10/10"
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-white/6">
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
            {testimonial ? "Update Testimonial" : "Add Testimonial"}
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
  );
}

export default function TestimonialsPanel({ showToast }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/testimonials");
      setTestimonials(data);
    } catch {
      showToast("Failed to load testimonials", "error");
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
        const { data } = await API.put(`/testimonials/${modal._id}`, form);
        setTestimonials((t) => t.map((x) => (x._id === modal._id ? data : x)));
        showToast("Testimonial updated!");
      } else {
        const { data } = await API.post("/testimonials", form);
        setTestimonials((t) => [...t, data]);
        showToast("Testimonial added!");
      }
      setModal(null);
    } catch {
      showToast("Failed to save", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await API.delete(`/testimonials/${id}`);
      setTestimonials((t) => t.filter((x) => x._id !== id));
      showToast("Testimonial deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("Replace all testimonials with sample data?")) return;
    setSeeding(true);
    try {
      const { data } = await API.post("/testimonials/seed");
      setTestimonials(data.data);
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
        <TestimonialModal
          testimonial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold">Client Testimonials</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Manage client reviews and ratings
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
            <FiPlus size={13} /> Add Testimonial
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 glass border border-white/8 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400 mb-4">No testimonials yet.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setModal("new")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              + Add Testimonial
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
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="glass border border-white/8 rounded-2xl p-5 group hover:border-white/15 transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    t.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6366f1&color=fff&size=200`
                  }
                  alt={t.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6366f1&color=fff&size=200`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <span className="text-white font-semibold text-sm">
                        {t.name}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {t.role} @ {t.company}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => setModal(t)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <HiStar key={i} size={12} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {t.review}
                  </p>
                  {t.metrics?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {t.metrics.map((m, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 text-gray-500 border border-white/8"
                        >
                          {m.label}: {m.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
