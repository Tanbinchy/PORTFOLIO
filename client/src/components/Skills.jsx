import React, { useRef, useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import API from '../utils/api';

const THEME = {
  indigo:  { grad: 'from-indigo-500 to-blue-500',    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',   bar: 'bg-gradient-to-r from-indigo-500 to-blue-400',    border: 'border-indigo-500/20',  glow: 'shadow-indigo-500/20'   },
  violet:  { grad: 'from-violet-500 to-purple-500',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  bar: 'bg-gradient-to-r from-violet-500 to-purple-400',  border: 'border-violet-500/20', glow: 'shadow-violet-500/20'  },
  cyan:    { grad: 'from-cyan-500 to-teal-500',      badge: 'bg-cyan-500/15   text-cyan-300   border-cyan-500/25',    bar: 'bg-gradient-to-r from-cyan-500 to-teal-400',      border: 'border-cyan-500/20',   glow: 'shadow-cyan-500/20'    },
  emerald: { grad: 'from-emerald-500 to-green-500',  badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', bar: 'bg-gradient-to-r from-emerald-500 to-green-400', border: 'border-emerald-500/20',glow: 'shadow-emerald-500/20' },
  pink:    { grad: 'from-pink-500 to-rose-500',      badge: 'bg-pink-500/15   text-pink-300   border-pink-500/25',    bar: 'bg-gradient-to-r from-pink-500 to-rose-400',      border: 'border-pink-500/20',   glow: 'shadow-pink-500/20'    },
  orange:  { grad: 'from-orange-500 to-amber-500',   badge: 'bg-orange-500/15 text-orange-300 border-orange-500/25',  bar: 'bg-gradient-to-r from-orange-500 to-amber-400',   border: 'border-orange-500/20', glow: 'shadow-orange-500/20'  },
  rose:    { grad: 'from-rose-500 to-pink-500',      badge: 'bg-rose-500/15   text-rose-300   border-rose-500/25',    bar: 'bg-gradient-to-r from-rose-500 to-pink-400',      border: 'border-rose-500/20',   glow: 'shadow-rose-500/20'    },
  amber:   { grad: 'from-amber-500 to-yellow-500',   badge: 'bg-amber-500/15  text-amber-300  border-amber-500/25',   bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',   border: 'border-amber-500/20',  glow: 'shadow-amber-500/20'   },
};

function SkillBar({ level, barClass, visible }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/6 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barClass}`}
        style={{ width: visible ? `${level}%` : '0%' }} />
    </div>
  );
}

function CategoryCard({ cat, visible }) {
  const theme = THEME[cat.colorTheme] || THEME.indigo;
  return (
    <div className={`stagger-item glass border ${theme.border} rounded-3xl p-6 card-hover shadow-xl ${theme.glow}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${theme.grad} shadow-lg`}>
          {cat.emoji}
        </div>
        <h3 className="text-lg font-bold text-white">{cat.title}</h3>
      </div>
      <div className="space-y-4">
        {(cat.skills || []).map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}`}>{skill.badge}</span>
                <span className="text-gray-500 text-xs w-8 text-right">{skill.level}%</span>
              </div>
            </div>
            <SkillBar level={skill.level} barClass={theme.bar} visible={visible} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const titleRef   = useScrollReveal('reveal', 0);
  const gridRef    = useStaggerReveal('.stagger-item', 0.12);
  const [visible,  setVisible]  = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    API.get('/skills')
      .then(({ data }) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div ref={titleRef} className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">What I Know</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-4" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Continuously learning and expanding my skill set to stay ahead of the rapidly evolving tech landscape.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass border border-white/8 rounded-3xl h-80 animate-pulse">
                <div className="m-6 h-12 bg-white/4 rounded-2xl w-1/3" />
                <div className="mx-6 space-y-4">
                  {[...Array(4)].map((__, j) => <div key={j} className="h-6 bg-white/4 rounded-full" />)}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🛠️</div>
            <p className="text-gray-400">No skills added yet. <a href="/admin/dashboard" className="text-indigo-400 hover:underline">Add some in the admin panel.</a></p>
          </div>
        ) : (
          <div ref={gridRef} className={`grid gap-6 ${categories.length <= 2 ? 'sm:grid-cols-2' : categories.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
            {categories.map((cat) => (
              <CategoryCard key={cat._id} cat={cat} visible={visible} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
