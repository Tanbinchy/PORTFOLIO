import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiX, FiImage } from 'react-icons/fi';
import { HiBadgeCheck } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import API from '../utils/api';

const CATEGORIES = ['Web App', 'Mobile', 'API', 'UI/UX', 'Other'];

const EMPTY = {
  title: '', description: '', longDescription: '',
  category: 'Web App', technologies: [],
  imageUrl: '', liveUrl: '', githubUrl: '',
  featured: false,
  metrics: { stars: 0, forks: 0, views: '0' },
  order: 0,
};

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { isDark } = useTheme();

  const [form,     setForm]     = useState(EMPTY);
  const [techInput,setTechInput]= useState('');
  const [loading,  setLoading]  = useState(isEdit);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [imgError, setImgError] = useState(false);

  /* Load project data if editing */
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        setForm({
          ...EMPTY,
          ...data,
          metrics: { stars: data.metrics?.stars ?? 0, forks: data.metrics?.forks ?? 0, views: data.metrics?.views ?? '0' },
        });
      } catch {
        setError('Project not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setMetric = (key, value) => setForm((f) => ({ ...f, metrics: { ...f.metrics, [key]: value } }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      set('technologies', [...form.technologies, t]);
    }
    setTechInput('');
  };

  const removeTech = (tech) => set('technologies', form.technologies.filter((t) => t !== tech));

  const handleTechKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech(); }
  };

  const validate = () => {
    if (!form.title.trim())       return 'Title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category)           return 'Category is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await API.put(`/projects/${id}`, form);
      } else {
        await API.post('/projects', form);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-400"
        style={{ backgroundColor: isDark ? '#05050f' : '#eef2ff' }}>
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white transition-colors duration-400"
      style={{ backgroundColor: isDark ? '#05050f' : '#eef2ff' }}>
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-dark border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors group">
            <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-white font-semibold text-sm">{isEdit ? 'Edit Project' : 'New Project'}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={14} />
          )}
          {saving ? 'Saving…' : 'Save Project'}
        </button>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── LEFT – main fields (2 cols) ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic info */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Basic Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Project Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      placeholder="My Awesome Project"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Short Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      rows={2}
                      placeholder="A brief one-line description shown on the project card"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Long Description</label>
                    <textarea
                      value={form.longDescription}
                      onChange={(e) => set('longDescription', e.target.value)}
                      rows={4}
                      placeholder="Detailed description with features, challenges, and technical decisions…"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => set('category', e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#0d0d1a]">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Sort Order</label>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) => set('order', parseInt(e.target.value) || 0)}
                        min={0}
                        className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Technologies</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKey}
                    placeholder="React, Node.js… (Enter or comma to add)"
                    className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-3 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/25 transition-all text-sm flex items-center gap-1"
                  >
                    <FiPlus size={15} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((tech) => (
                    <span key={tech} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="text-indigo-400/60 hover:text-red-400 transition-colors">
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                  {form.technologies.length === 0 && (
                    <span className="text-gray-700 text-xs italic">No technologies added yet</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Live URL</label>
                    <input
                      type="url"
                      value={form.liveUrl}
                      onChange={(e) => set('liveUrl', e.target.value)}
                      placeholder="https://myproject.com"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">GitHub URL</label>
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) => set('githubUrl', e.target.value)}
                      placeholder="https://github.com/user/repo"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT – image + metrics + featured ── */}
            <div className="space-y-6">

              {/* Image */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Project Image</h3>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Image URL</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => { set('imageUrl', e.target.value); setImgError(false); }}
                    placeholder="https://images.unsplash.com/…"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm mb-4"
                  />
                  {/* Preview */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white/4 border border-white/6 flex items-center justify-center">
                    {form.imageUrl && !imgError ? (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-600">
                        <FiImage size={28} />
                        <span className="text-xs">{imgError ? 'Invalid image URL' : 'Image preview'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Featured toggle */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Settings</h3>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                      <HiBadgeCheck size={16} className="text-indigo-400" /> Featured Project
                    </div>
                    <div className="text-gray-600 text-xs mt-0.5">Shown first in the projects grid</div>
                  </div>
                  <div
                    onClick={() => set('featured', !form.featured)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.featured ? 'bg-indigo-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              </div>

              {/* Metrics */}
              <div className="glass border border-white/8 rounded-3xl p-7">
                <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">GitHub Stars</label>
                    <input
                      type="number"
                      value={form.metrics.stars}
                      onChange={(e) => setMetric('stars', parseInt(e.target.value) || 0)}
                      min={0}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Forks</label>
                    <input
                      type="number"
                      value={form.metrics.forks}
                      onChange={(e) => setMetric('forks', parseInt(e.target.value) || 0)}
                      min={0}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Views (display)</label>
                    <input
                      type="text"
                      value={form.metrics.views}
                      onChange={(e) => setMetric('views', e.target.value)}
                      placeholder="12K"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Save button (mobile bottom) */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-xl hover:shadow-indigo-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><FiSave size={15} /> {isEdit ? 'Update Project' : 'Create Project'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
