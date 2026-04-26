import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiDatabase } from 'react-icons/fi';
import API from '../../utils/api';

const EMPTY_STAT = { value: '', label: '', order: 0 };

function StatRow({ stat, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState(stat);
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    if (!form.value.trim() || !form.label.trim()) return;
    setSaving(true);
    await onSave(stat._id, form);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="glass border border-indigo-500/25 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[100px]">
          <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Value</label>
          <input value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))}
            placeholder="50+" className="glass-input w-full px-3 py-2 rounded-xl text-sm" />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Label</label>
          <input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))}
            placeholder="Projects Done" className="glass-input w-full px-3 py-2 rounded-xl text-sm" />
        </div>
        <div className="w-20">
          <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Order</label>
          <input type="number" value={form.order} onChange={e => setForm(f => ({...f, order: +e.target.value}))}
            className="glass-input w-full px-3 py-2 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50">
            {saving ? <div className="w-3 h-3 border border-t-white border-white/30 rounded-full animate-spin" /> : <FiSave size={12} />} Save
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl text-xs text-gray-400 glass border border-white/10 hover:text-white transition-all">
            <FiX size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/8 rounded-2xl p-4 flex items-center justify-between group hover:border-white/15 transition-all">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[60px]">
          <div className="text-xl font-extrabold gradient-text">{stat.value}</div>
          <div className="text-gray-500 text-xs">{stat.label}</div>
        </div>
        <span className="text-gray-700 text-xs">Order: {stat.order}</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => { setForm(stat); setEditing(true); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
          <FiEdit2 size={13} />
        </button>
        <button onClick={() => onDelete(stat._id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <FiTrash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function AddStatRow({ onAdd }) {
  const [form,   setForm]   = useState(EMPTY_STAT);
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.value.trim() || !form.label.trim()) return;
    setSaving(true);
    await onAdd(form);
    setForm(EMPTY_STAT);
    setOpen(false);
    setSaving(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl glass border border-dashed border-white/15 text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all text-sm">
        <FiPlus size={15} /> Add Stat
      </button>
    );
  }
  return (
    <div className="glass border border-indigo-500/25 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[100px]">
        <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Value</label>
        <input value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))}
          placeholder="50+" className="glass-input w-full px-3 py-2 rounded-xl text-sm" autoFocus />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Label</label>
        <input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))}
          placeholder="Projects Done" className="glass-input w-full px-3 py-2 rounded-xl text-sm" />
      </div>
      <div className="w-20">
        <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Order</label>
        <input type="number" value={form.order} onChange={e => setForm(f => ({...f, order: +e.target.value}))}
          className="glass-input w-full px-3 py-2 rounded-xl text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50">
          {saving ? <div className="w-3 h-3 border border-t-white border-white/30 rounded-full animate-spin" /> : <FiPlus size={12} />} Add
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-xs text-gray-400 glass border border-white/10 hover:text-white">
          <FiX size={12} />
        </button>
      </div>
    </div>
  );
}

export default function StatsPanel({ showToast }) {
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/stats'); setStats(data); }
    catch { showToast('Failed to load stats', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    try { const { data } = await API.post('/stats', form); setStats(s => [...s, data]); showToast('Stat added'); }
    catch { showToast('Failed to add stat', 'error'); }
  };

  const handleSave = async (id, form) => {
    try { const { data } = await API.put(`/stats/${id}`, form); setStats(s => s.map(x => x._id === id ? data : x)); showToast('Stat updated'); }
    catch { showToast('Failed to update stat', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    try { await API.delete(`/stats/${id}`); setStats(s => s.filter(x => x._id !== id)); showToast('Stat deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const handleSeed = async () => {
    if (!window.confirm('Replace all stats with sample data?')) return;
    setSeeding(true);
    try { const { data } = await API.post('/stats/seed'); setStats(data.data); showToast(data.message); }
    catch { showToast('Seeding failed', 'error'); }
    finally { setSeeding(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold">About Section Stats</h3>
          <p className="text-gray-500 text-xs mt-0.5">These appear as the stat cards in the About section (Years Exp., Projects Done, etc.)</p>
        </div>
        <button onClick={handleSeed} disabled={seeding}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-amber-400 glass border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50">
          {seeding ? <div className="w-3 h-3 border border-t-amber-400 border-amber-400/30 rounded-full animate-spin" /> : <FiDatabase size={12} />} Seed Sample
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-16 glass border border-white/8 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {stats.map(stat => <StatRow key={stat._id} stat={stat} onSave={handleSave} onDelete={handleDelete} />)}
          <AddStatRow onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
