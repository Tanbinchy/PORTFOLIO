import React, { useState, useEffect } from "react";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiArrowUp,
} from "react-icons/fi";

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const services = [
  "Web Development",
  "API Development",
  "Mobile Apps",
  "UI/UX Design",
  "Database Design",
  "Performance Audit",
];

const socials = [
  { icon: FiGithub, href: "https://github.com/Tanbinchy", label: "GitHub" },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/ashiful-hoque-chowdhury-704718299/",
    label: "LinkedIn",
  },
  { icon: FiTwitter, href: "https://x.com/tanshu_Moni", label: "Twitter" },
  // { icon: FiMail, href: "https://mail.google.com/", label: "Email" },
];

function HeartIcon() {
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 400);
    }, 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="inline-block transition-transform duration-150 text-red-500"
      style={{ transform: beat ? "scale(1.3)" : "scale(1)" }}
    >
      ❤️
    </span>
  );
}

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#030308]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                TC
              </div>
              <span className="text-white font-bold text-lg">
                <span className="gradient-text">Tanbin.</span>Chy
              </span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed mb-5 max-w-xs">
              Crafting beautiful, performant web experiences one component at a
              time. Let's build something remarkable together.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-gray-600 hover:text-indigo-400 text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-indigo-500 group-hover:w-3 transition-all duration-300" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-indigo-400 text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-indigo-500 group-hover:w-3 transition-all duration-300" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">
              Hire Me
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              Have a project in mind? Let's turn your idea into a beautiful
              reality.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get In Touch →
            </a>
            <div className="mt-5 text-xs text-gray-600">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>tanbinchy@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>North Kattali, Chattogram, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent mb-7" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          {/* Left */}
          <span>
            © {new Date().getFullYear()} Tanbin Chy. All rights reserved.
          </span>

          {/* Right */}
          <div className="flex items-center gap-4 ml-auto">
            <span className="flex items-center gap-1.5">
              Built with <HeartIcon /> using React & Tailwind CSS
            </span>

            <a
              href="/admin/login"
              className="text-gray-800 hover:text-indigo-500 transition-colors"
            >
              Admin →
            </a>
          </div>
        </div>
      </div>

      {/* Back-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-1 ${
          showTop
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <FiArrowUp size={18} />
      </button>
    </footer>
  );
}
