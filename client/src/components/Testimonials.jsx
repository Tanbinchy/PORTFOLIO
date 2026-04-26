import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import API from '../utils/api';

export default function Testimonials() {
  const titleRef = useScrollReveal('reveal', 0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    API.get('/testimonials')
      .then(({ data }) => setTestimonials(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const navigate = useCallback((dir) => {
    if (animating || testimonials.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
      setAnimating(false);
    }, 250);
  }, [animating, testimonials.length]);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => navigate(1), 6000);
    return () => clearInterval(t);
  }, [navigate, testimonials.length]);

  if (loading) {
    return (
      <section id="testimonials" className="section-padding">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass border border-white/8 rounded-3xl h-72 animate-pulse" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400">No testimonials added yet. <a href="/admin/dashboard" className="text-indigo-400 hover:underline">Add some in the admin panel.</a></p>
        </div>
      </section>
    );
  }

  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Happy Clients</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Client <span className="gradient-text">Reviews</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-4" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Don't just take my word for it — here's what clients say about working with me.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`glass border border-white/8 rounded-3xl p-8 sm:p-10 transition-opacity duration-250 ${animating ? 'opacity-0' : 'opacity-100'}`}
            style={{ minHeight: '340px' }}
          >
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Photo + info */}
              <div className="flex flex-col items-center sm:items-start shrink-0 gap-4">
                <div className="relative">
                  <img
                    src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6366f1&color=fff&size=200`}
                    alt={t.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover grayscale-img border-2 border-white/10"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6366f1&color=fff&size=200`; }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white">✓</div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(Math.min(Math.max(t.rating || 5, 1), 5))].map((_, i) => (
                    <HiStar key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                  <div className="text-indigo-400 text-xs font-medium">{t.company}</div>
                </div>
              </div>

              {/* Review + metrics */}
              <div className="flex-1">
                <div className="text-4xl text-indigo-500/40 font-serif leading-none mb-3 select-none">"</div>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-6 italic">{t.review}</p>
                <div className="text-4xl text-indigo-500/40 font-serif leading-none mb-6 text-right select-none">"</div>
                {t.metrics?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {t.metrics.map(({ label, value }, i) => (
                      <div key={i} className="glass border border-white/8 rounded-xl px-3 py-2 text-center min-w-[80px]">
                        <div className="text-xs font-bold gradient-text">{value}</div>
                        <div className="text-gray-600 text-[10px] mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all">
              <FiChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-3 bg-gradient-to-r from-indigo-500 to-violet-500' : 'w-3 h-3 bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
            <button onClick={() => navigate(1)} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all">
              <FiChevronRight size={18} />
            </button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-3">{current + 1} / {testimonials.length}</p>
        </div>
      </div>
    </section>
  );
}
