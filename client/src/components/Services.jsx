import React, { useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import API from '../utils/api';

const THEME = {
  indigo:  { grad: 'from-indigo-600/20 via-violet-600/10 to-transparent', border: 'border-indigo-500/25',  tag: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',  blob: 'bg-indigo-500/10 group-hover:bg-indigo-500/20'  },
  violet:  { grad: 'from-violet-600/15 to-transparent',                   border: 'border-violet-500/20',  tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20',  blob: 'bg-violet-500/10 group-hover:bg-violet-500/20'  },
  cyan:    { grad: 'from-cyan-600/15 to-transparent',                     border: 'border-cyan-500/20',    tag: 'bg-cyan-500/10   text-cyan-300   border-cyan-500/20',    blob: 'bg-cyan-500/10   group-hover:bg-cyan-500/20'    },
  pink:    { grad: 'from-pink-600/15 to-transparent',                     border: 'border-pink-500/20',    tag: 'bg-pink-500/10   text-pink-300   border-pink-500/20',    blob: 'bg-pink-500/10   group-hover:bg-pink-500/20'    },
  emerald: { grad: 'from-emerald-600/15 to-transparent',                  border: 'border-emerald-500/20', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', blob: 'bg-emerald-500/10 group-hover:bg-emerald-500/20' },
  orange:  { grad: 'from-orange-600/15 to-transparent',                   border: 'border-orange-500/20',  tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20',  blob: 'bg-orange-500/10 group-hover:bg-orange-500/20'  },
  rose:    { grad: 'from-rose-600/15 to-transparent',                     border: 'border-rose-500/20',    tag: 'bg-rose-500/10   text-rose-300   border-rose-500/20',    blob: 'bg-rose-500/10   group-hover:bg-rose-500/20'    },
  amber:   { grad: 'from-amber-600/15 to-transparent',                    border: 'border-amber-500/20',   tag: 'bg-amber-500/10  text-amber-300  border-amber-500/20',   blob: 'bg-amber-500/10  group-hover:bg-amber-500/20'   },
};

export default function Services() {
  const titleRef = useScrollReveal('reveal', 0);
  const gridRef  = useStaggerReveal('.stagger-item', 0.08);
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/services')
      .then(({ data }) => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = services.find((s) => s.featured);
  const rest     = services.filter((s) => !s.featured);

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div ref={titleRef} className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">What I Offer</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            My <span className="gradient-text">Services</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-4" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            From idea to deployment — I offer a comprehensive range of development and design services.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`glass border border-white/8 rounded-3xl animate-pulse ${i === 0 ? 'md:col-span-2 h-52' : 'h-44'}`} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚡</div>
            <p className="text-gray-400">No services added yet. <a href="/admin/dashboard" className="text-indigo-400 hover:underline">Add some in the admin panel.</a></p>
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Featured large card */}
            {featured && (() => {
              const t = THEME[featured.colorTheme] || THEME.indigo;
              return (
                <div className={`stagger-item md:col-span-2 glass border ${t.border} rounded-3xl p-8 bg-gradient-to-br ${t.grad} card-hover glow-hover group relative overflow-hidden`}>
                  <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 pointer-events-none ${t.blob}`} />
                  <div className="relative z-10">
                    <div className="text-5xl mb-5">{featured.icon}</div>
                    <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:gradient-text transition-all">{featured.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6 max-w-lg text-sm">{featured.description}</p>
                    {featured.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featured.tags.map((tag) => (
                          <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full border ${t.tag}`}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Rest */}
            {rest.map((svc) => {
              const t = THEME[svc.colorTheme] || THEME.violet;
              return (
                <div key={svc._id} className={`stagger-item glass border ${t.border} rounded-3xl p-6 card-hover glow-hover flex flex-col gap-3 bg-gradient-to-br ${t.grad} group`}>
                  <div className="text-3xl">{svc.icon}</div>
                  <h3 className="text-white font-bold text-base leading-snug group-hover:gradient-text transition-all">{svc.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{svc.description}</p>
                  {svc.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {svc.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.tag}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
