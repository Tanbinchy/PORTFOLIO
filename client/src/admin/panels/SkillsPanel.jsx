import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiChevronDown, FiChevronUp, FiDatabase } from 'react-icons/fi';
import API from '../../utils/api';

const THEMES = ['indigo','violet','cyan','emerald','pink','orange','rose','amber'];
const BADGES = ['Beginner','Proficient','Advanced','Expert'];
const EMOJIS = ['🎨','⚙️','🗄️','🛠️','📱','🌐','⚡','🚀','🔐','📊'];

const EMPTY_CAT  = { title: '', emoji: '⚡', colorTheme: 'indigo', skills: [], order: 0 };
const EMPTY_SKILL= { name: '', level: 80, badge: 'Advanced' };

function SkillItem({ skill, catId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(skill);
  if (editing) return (
    <div className="flex flex-wrap gap-2 items-end p-3 glass border border-indigo-500/20 rounded-xl">
      <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Skill name" className="glass-input flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs" />
      <input type="number" value={form.level} onChange={e => setForm(f=>({...f,level:+e.target.value}))} min={0} max={100} className="glass-input w-16 px-3 py-2 rounded-lg text-xs" />
      <select value={form.badge} onChange={e => setForm(f=>({...f,badge:e.target.value}))} className="glass-input px-3 py-2 rounded-lg text-xs">
        {BADGES.map(b=><option key={b} value={b} className="bg-[#0d0d1a]">{b}</option>)}
      </select>
      <div className="flex gap-1">
        <button onClick={() => { onUpdate(form); setEditing(false); }} className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-xs"><FiSave size={11}/></button>
        <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-lg glass border border-white/10 text-gray-400 text-xs"><FiX size={11}/></button>
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/3 group transition-all">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-300 text-xs font-medium">{skill.name}</span>
          <span className="text-gray-600 text-[10px]">{skill.level}% · {skill.badge}</span>
        </div>
        <div className="w-full h-1 bg-white/6 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full" style={{width:`${skill.level}%`}} />
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => { setForm(skill); setEditing(true); }} className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><FiEdit2 size={11}/></button>
        <button onClick={() => onDelete(skill.name)} className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={11}/></button>
      </div>
    </div>
  );
}

function CategoryCard({ cat, onSave, onDelete }) {
  const [expanded,  setExpanded]  = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [form,      setForm]      = useState(cat);
  const [newSkill,  setNewSkill]  = useState(EMPTY_SKILL);
  const [addingSkill,setAdding]   = useState(false);
  const [saving,    setSaving]    = useState(false);

  const saveCategory = async () => {
    setSaving(true);
    await onSave(cat._id, form);
    setEditing(false);
    setSaving(false);
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setForm(f => ({ ...f, skills: [...f.skills, { ...newSkill }] }));
    setNewSkill(EMPTY_SKILL);
    setAdding(false);
  };

  const updateSkill = (oldName, updated) => {
    setForm(f => ({ ...f, skills: f.skills.map(s => s.name === oldName ? updated : s) }));
  };

  const deleteSkill = (name) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s.name !== name) }));
  };

  return (
    <div className="glass border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <span className="text-2xl">{cat.emoji}</span>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">{cat.title}</div>
          <div className="text-gray-600 text-xs">{cat.skills?.length || 0} skills · {cat.colorTheme}</div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setForm(cat); setEditing(!editing); setExpanded(true); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
            <FiEdit2 size={13}/>
          </button>
          <button onClick={() => onDelete(cat._id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <FiTrash2 size={13}/>
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all">
            {expanded ? <FiChevronUp size={15}/> : <FiChevronDown size={15}/>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/6 p-4 space-y-3">
          {/* Edit form */}
          {editing && (
            <div className="glass border border-indigo-500/20 rounded-xl p-4 space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className="glass-input w-full px-3 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(f=>({...f,order:+e.target.value}))} className="glass-input w-full px-3 py-2 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Emoji</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map(e => (
                      <button key={e} onClick={() => setForm(f=>({...f,emoji:e}))}
                        className={`w-8 h-8 rounded-lg text-base transition-all ${form.emoji===e ? 'bg-indigo-500/20 border border-indigo-500/40' : 'hover:bg-white/8'}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Color Theme</label>
                  <div className="flex flex-wrap gap-1">
                    {THEMES.map(t => (
                      <button key={t} onClick={() => setForm(f=>({...f,colorTheme:t}))}
                        className={`px-2 py-1 rounded text-[10px] font-semibold capitalize transition-all ${form.colorTheme===t ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'text-gray-500 glass border border-white/8 hover:text-white'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveCategory} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50">
                  {saving ? <div className="w-3 h-3 border border-t-white border-white/30 rounded-full animate-spin"/> : <FiSave size={12}/>} Save Category
                </button>
                <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl text-xs text-gray-400 glass border border-white/10"><FiX size={12}/></button>
              </div>
            </div>
          )}

          {/* Skills list */}
          {(form.skills || []).map(skill => (
            <SkillItem key={skill.name} skill={skill} catId={cat._id}
              onUpdate={updated => { updateSkill(skill.name, updated); }}
              onDelete={name => { deleteSkill(name); }} />
          ))}

          {/* Add skill */}
          {addingSkill ? (
            <div className="flex flex-wrap gap-2 items-end p-3 glass border border-indigo-500/20 rounded-xl">
              <input value={newSkill.name} onChange={e => setNewSkill(f=>({...f,name:e.target.value}))} placeholder="Skill name" className="glass-input flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs" autoFocus />
              <input type="number" value={newSkill.level} onChange={e => setNewSkill(f=>({...f,level:+e.target.value}))} min={0} max={100} className="glass-input w-16 px-3 py-2 rounded-lg text-xs" />
              <select value={newSkill.badge} onChange={e => setNewSkill(f=>({...f,badge:e.target.value}))} className="glass-input px-3 py-2 rounded-lg text-xs">
                {BADGES.map(b=><option key={b} value={b} className="bg-[#0d0d1a]">{b}</option>)}
              </select>
              <div className="flex gap-1">
                <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-xs"><FiPlus size={11}/></button>
                <button onClick={() => setAdding(false)} className="px-3 py-2 rounded-lg glass border border-white/10 text-gray-400 text-xs"><FiX size={11}/></button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-gray-500 hover:text-indigo-400 border border-dashed border-white/10 hover:border-indigo-500/30 transition-all">
              <FiPlus size={12}/> Add Skill
            </button>
          )}

          {/* Save skills button when editing */}
          {editing && (
            <button onClick={saveCategory} disabled={saving}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <div className="w-3 h-3 border border-t-white border-white/30 rounded-full animate-spin"/> : <FiSave size={11}/>} Save All Changes
            </button>
          )}
          {!editing && form.skills !== cat.skills && (
            <button onClick={saveCategory} disabled={saving}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <div className="w-3 h-3 border border-t-white border-white/30 rounded-full animate-spin"/> : <FiSave size={11}/>} Save Skill Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AddCategoryForm({ onAdd }) {
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState(EMPTY_CAT);
  const [saving,setSaving]= useState(false);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onAdd(form);
    setForm(EMPTY_CAT);
    setOpen(false);
    setSaving(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl glass border border-dashed border-white/15 text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
      <FiPlus size={15}/> Add Skill Category
    </button>
  );

  return (
    <div className="glass border border-indigo-500/25 rounded-2xl p-5 space-y-4">
      <h4 className="text-white font-semibold text-sm">New Skill Category</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="Frontend" className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" autoFocus />
        </div>
        <div>
          <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Order</label>
          <input type="number" value={form.order} onChange={e => setForm(f=>({...f,order:+e.target.value}))} className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
        </div>
      </div>
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-2">Emoji</label>
        <div className="flex flex-wrap gap-1">
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setForm(f=>({...f,emoji:e}))}
              className={`w-9 h-9 rounded-xl text-lg transition-all ${form.emoji===e ? 'bg-indigo-500/20 border border-indigo-500/40' : 'hover:bg-white/8 glass border border-white/6'}`}>{e}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-2">Color Theme</label>
        <div className="flex flex-wrap gap-1">
          {THEMES.map(t => (
            <button key={t} onClick={() => setForm(f=>({...f,colorTheme:t}))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${form.colorTheme===t ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'text-gray-500 glass border border-white/8 hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 disabled:opacity-50">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <FiPlus size={14}/>} Create Category
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-gray-400 glass border border-white/10"><FiX size={14}/></button>
      </div>
    </div>
  );
}

export default function SkillsPanel({ showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [seeding,  setSeeding]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/skills'); setCategories(data); }
    catch { showToast('Failed to load skills', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    try { const { data } = await API.post('/skills', form); setCategories(c => [...c, data]); showToast('Category created!'); }
    catch { showToast('Failed to create category', 'error'); }
  };

  const handleSave = async (id, form) => {
    try { const { data } = await API.put(`/skills/${id}`, form); setCategories(c => c.map(x => x._id === id ? data : x)); showToast('Category updated!'); }
    catch { showToast('Failed to update', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill category?')) return;
    try { await API.delete(`/skills/${id}`); setCategories(c => c.filter(x => x._id !== id)); showToast('Category deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const handleSeed = async () => {
    if (!window.confirm('Replace all skills with sample data?')) return;
    setSeeding(true);
    try { const { data } = await API.post('/skills/seed'); setCategories(data.data); showToast(data.message); }
    catch { showToast('Seeding failed', 'error'); }
    finally { setSeeding(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold">Skills & Expertise</h3>
          <p className="text-gray-500 text-xs mt-0.5">Manage skill categories and individual proficiency levels</p>
        </div>
        <button onClick={handleSeed} disabled={seeding}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-amber-400 glass border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50">
          {seeding ? <div className="w-3 h-3 border border-t-amber-400 border-amber-400/30 rounded-full animate-spin"/> : <FiDatabase size={12}/>} Seed Sample
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-20 glass border border-white/8 rounded-2xl animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => <CategoryCard key={cat._id} cat={cat} onSave={handleSave} onDelete={handleDelete}/>)}
          <AddCategoryForm onAdd={handleAdd}/>
        </div>
      )}
    </div>
  );
}
