import React, { useState, useEffect } from "react";
import { FiSave, FiPlus, FiX } from "react-icons/fi";
// import { FiDatabase } from "react-icons/fi";

import API from "../../utils/api";

const DEFAULTS = {
  name: "Ashiful Hoque Chowdhury Tanbin",
  tagline: "Passionate developer building the future of the web",
  bio1: "",
  bio2: "",
  location: "North Kattali, Chattogram, Bangladesh",
  email: "tanbinchy@gmail.com",
  available: true,
  profileImage: "",
  resumeUrl: "/resume.pdf",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  techBadges: [],
};

/* ─────────────────────────────────────────────────────────────────────────────
   Field is defined OUTSIDE AboutPanel so its identity never changes between
   renders. Defining it inside the parent caused React to unmount/remount it
   on every keystroke, immediately losing cursor focus.
───────────────────────────────────────────────────────────────────────────── */
function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  form,
  onChange,
}) {
  return (
    <div>
      <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={form[name] || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full px-4 py-3 rounded-xl text-sm"
      />
    </div>
  );
}

export default function AboutPanel({ showToast }) {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // const [seeding, setSeeding] = useState(false);
  const [badgeInput, setBadgeInput] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    API.get("/about")
      .then(({ data }) => setForm({ ...DEFAULTS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addBadge = () => {
    const b = badgeInput.trim();
    if (b && !form.techBadges.includes(b))
      set("techBadges", [...form.techBadges, b]);
    setBadgeInput("");
  };

  const removeBadge = (b) =>
    set(
      "techBadges",
      form.techBadges.filter((x) => x !== b),
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put("/about", form);
      setForm({ ...DEFAULTS, ...data });
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // const handleSeed = async () => {
  //   if (!window.confirm("Reset About section to sample data?")) return;
  //   setSeeding(true);
  //   try {
  //     const { data } = await API.post("/about/seed");
  //     setForm({ ...DEFAULTS, ...data.data });
  //     showToast("About seeded with sample data!");
  //   } catch {
  //     showToast("Seeding failed", "error");
  //   } finally {
  //     setSeeding(false);
  //   }
  // };

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-14 glass border border-white/8 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold">About &amp; Profile</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Controls the Hero and About sections of your portfolio
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-amber-400 glass border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50"
          >
            {seeding ? (
              <div className="w-3 h-3 border border-t-amber-400 border-amber-400/30 rounded-full animate-spin" />
            ) : (
              <FiDatabase size={12} />
            )}{" "}
            Seed Sample
          </button> */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave size={14} />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left – main fields ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="glass border border-white/8 rounded-3xl p-6 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Personal Info
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                name="name"
                placeholder="Ashiful Hoque Chowdhury Tanbin"
                form={form}
                onChange={set}
              />
              <Field
                label="Location"
                name="location"
                placeholder="San Francisco, CA"
                form={form}
                onChange={set}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                form={form}
                onChange={set}
              />
              <div>
                <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
                  Availability
                </label>
                <button
                  onClick={() => set("available", !form.available)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl glass border transition-all text-sm font-medium w-full ${
                    form.available
                      ? "border-green-500/25 text-green-400 bg-green-500/5"
                      : "border-red-500/25 text-red-400 bg-red-500/5"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${form.available ? "bg-green-400 animate-pulse" : "bg-red-500"}`}
                  />
                  {form.available ? "Available for Work" : "Not Available"}
                </button>
              </div>
            </div>
          </div>

          {/* Bio & Tagline */}
          <div className="glass border border-white/8 rounded-3xl p-6 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Bio &amp; Tagline
            </h4>
            <div>
              <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
                Tagline
              </label>
              <input
                value={form.tagline || ""}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Passionate developer building the future of the web"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
                Bio Paragraph 1
              </label>
              <textarea
                value={form.bio1 || ""}
                onChange={(e) => set("bio1", e.target.value)}
                rows={3}
                placeholder="I'm a Full Stack Developer with over 3 years of experience…"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
                Bio Paragraph 2
              </label>
              <textarea
                value={form.bio2 || ""}
                onChange={(e) => set("bio2", e.target.value)}
                rows={3}
                placeholder="When I'm not coding, I'm contributing to open-source…"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>
          </div>

          {/* Social + Resume */}
          <div className="glass border border-white/8 rounded-3xl p-6 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Links &amp; Social
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="GitHub URL"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/user"
                form={form}
                onChange={set}
              />
              <Field
                label="LinkedIn URL"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/user"
                form={form}
                onChange={set}
              />
              <Field
                label="Twitter URL"
                name="twitterUrl"
                type="url"
                placeholder="https://twitter.com/user"
                form={form}
                onChange={set}
              />
              <Field
                label="Resume URL"
                name="resumeUrl"
                placeholder="/resume.pdf"
                form={form}
                onChange={set}
              />
            </div>
          </div>

          {/* Tech badges */}
          <div className="glass border border-white/8 rounded-3xl p-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Tech Stack Badges
            </h4>
            <div className="flex gap-2 mb-4">
              <input
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addBadge();
                  }
                }}
                placeholder="React, Node.js… (Enter to add)"
                className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
              />
              <button
                onClick={addBadge}
                className="px-4 py-3 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/25 transition-all text-sm flex items-center gap-1"
              >
                <FiPlus size={14} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.techBadges || []).map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
                >
                  {b}
                  <button
                    onClick={() => removeBadge(b)}
                    className="text-indigo-400/60 hover:text-red-400 transition-colors"
                  >
                    <FiX size={11} />
                  </button>
                </span>
              ))}
              {(form.techBadges || []).length === 0 && (
                <span className="text-gray-600 text-xs italic">
                  No badges added yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right – profile image + preview ── */}
        <div className="space-y-5">
          <div className="glass border border-white/8 rounded-3xl p-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Profile Image
            </h4>
            <label className="block text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">
              Image URL
            </label>
            <input
              value={form.profileImage || ""}
              onChange={(e) => {
                set("profileImage", e.target.value);
                setImgError(false);
              }}
              placeholder="https://images.unsplash.com/…"
              className="glass-input w-full px-4 py-3 rounded-xl text-sm mb-4"
            />
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/4 border border-white/6 flex items-center justify-center">
              {form.profileImage && !imgError ? (
                <img
                  src={form.profileImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="text-xs">
                    {imgError ? "Invalid URL" : "Preview"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick preview */}
          <div className="glass border border-white/8 rounded-3xl p-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Preview
            </h4>
            <div className="space-y-2 text-xs">
              {[
                ["Name", form.name],
                ["Location", form.location],
                ["Email", form.email],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-500 w-20 shrink-0">{k}:</span>
                  <span className="text-gray-300 truncate">{v}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 shrink-0">Status:</span>
                <span
                  className={form.available ? "text-green-400" : "text-red-400"}
                >
                  {form.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 shrink-0">Badges:</span>
                <span className="text-gray-300">
                  {form.techBadges?.length || 0} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
