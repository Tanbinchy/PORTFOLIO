import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiSettings } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Dynamic classes that adapt to theme
  const navBg = scrolled
    ? isDark
      ? "bg-[rgba(5,5,15,0.82)] border-b border-white/5 shadow-2xl shadow-black/40"
      : "bg-[rgba(238,242,255,0.92)] border-b border-indigo-200/60 shadow-xl shadow-indigo-100/60"
    : "bg-transparent";

  const linkActive = isDark
    ? "text-white bg-white/8"
    : "text-indigo-700 bg-indigo-500/10";

  const linkIdle = isDark
    ? "text-gray-400 hover:text-white hover:bg-white/5"
    : "text-indigo-400 hover:text-indigo-700 hover:bg-indigo-500/8";

  const logoText = isDark ? "text-white" : "text-indigo-900";
  const mobileMenuBg = isDark
    ? "bg-[rgba(5,5,15,0.95)] border-t border-white/5"
    : "bg-[rgba(238,242,255,0.97)] border-t border-indigo-200/50";
  const mobileLink = isDark
    ? "text-gray-300 hover:text-white hover:bg-white/6"
    : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-500/8";
  const toggleBtnBase = isDark
    ? "glass border border-white/10 text-gray-300 hover:text-yellow-300 hover:border-yellow-400/30 hover:bg-yellow-400/8"
    : "bg-white/80 border border-indigo-200 text-indigo-500 hover:text-amber-500 hover:border-amber-400/50 hover:bg-amber-50";
  const adminBtnBase = isDark
    ? "glass border border-white/10 text-gray-400 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-500/10"
    : "bg-white/80 border border-indigo-200 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50";
  const mobileToggleBtn = isDark
    ? "glass border border-white/10 text-white"
    : "bg-white/80 border border-indigo-200 text-indigo-700";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              TC
            </div>
            <span className={`font-bold text-lg hidden sm:block ${logoText}`}>
              <span className="gradient-text">Tanbin.</span>Chy
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleLink(e, href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeId === href.replace("#", "") ? linkActive : linkIdle
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${toggleBtnBase}`}
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Admin button */}
            <a
              href="/admin/dashboard"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${adminBtnBase}`}
            >
              <FiSettings size={16} />
            </a>

            {/* Hire Me CTA */}
            <a
              href="#contact"
              onClick={(e) => handleLink(e, "#contact")}
              className="hidden sm:flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-px"
            >
              Hire Me
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-all ${mobileToggleBtn}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`${mobileMenuBg} px-4 py-4 space-y-1`}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleLink(e, href)}
              className={`block px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${mobileLink}`}
            >
              {label}
            </a>
          ))}

          <div className="pt-3 flex gap-2">
            <a
              href="#contact"
              onClick={(e) => handleLink(e, "#contact")}
              className="flex-1 px-4 py-2.5 text-center rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 text-sm"
            >
              Hire Me
            </a>
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${toggleBtnBase}`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <a
              href="/admin/dashboard"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${adminBtnBase}`}
              aria-label="Admin"
            >
              <FiSettings size={16} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
