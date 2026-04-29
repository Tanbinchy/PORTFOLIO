import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLogOut,
  FiRefreshCw,
  FiDatabase,
  FiMenu,
  FiX,
  FiFolder,
  FiStar,
  FiMessageSquare,
  FiInfo,
  FiTool,
  FiBarChart2,
  FiPlus,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../utils/api";

// Section panels
import ProjectsPanel from "./panels/ProjectsPanel";
import SkillsPanel from "./panels/SkillsPanel";
import ServicesPanel from "./panels/ServicesPanel";
import TestimonialsPanel from "./panels/TestimonialsPanel";
import StatsPanel from "./panels/StatsPanel";
import AboutPanel from "./panels/AboutPanel";
import MessagesPanel from "./panels/MessagesPanel";

const NAV = [
  { id: "projects", label: "Projects", icon: FiFolder, badge: null },
  { id: "skills", label: "Skills", icon: FiBarChart2, badge: null },
  { id: "services", label: "Services", icon: FiTool, badge: null },
  { id: "testimonials", label: "Testimonials", icon: FiStar, badge: null },
  { id: "stats", label: "Stats", icon: FiDatabase, badge: null },
  { id: "about", label: "Profile", icon: FiInfo, badge: null },
  {
    id: "messages",
    label: "Messages",
    icon: FiMessageSquare,
    badge: "messages",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebar] = useState(false);
  const [counts, setCounts] = useState({});
  const [toast, setToast] = useState(null);
  const [seedingAll, setSeedingAll] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Load counts for badges
  const loadCounts = useCallback(async () => {
    try {
      const [proj, msg] = await Promise.all([
        API.get("/projects"),
        API.get("/contact"),
      ]);
      setCounts({
        projects: proj.data.length,
        messages: msg.data.filter((m) => !m.read).length,
      });
    } catch {}
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const seedAll = async () => {
    if (
      !window.confirm(
        "Seed ALL sections with sample data? This will overwrite existing data in each category.",
      )
    )
      return;
    setSeedingAll(true);
    try {
      await Promise.all([
        API.post("/projects/seed/sample"),
        API.post("/stats/seed"),
        API.post("/about/seed"),
        API.post("/skills/seed"),
        API.post("/services/seed"),
        API.post("/testimonials/seed"),
      ]);
      showToast("✅ All sections seeded with sample data!");
      loadCounts();
    } catch (err) {
      showToast(
        "Seeding failed: " + (err.response?.data?.message || err.message),
        "error",
      );
    } finally {
      setSeedingAll(false);
    }
  };

  const panels = {
    projects: (
      <ProjectsPanel showToast={showToast} onCountChange={loadCounts} />
    ),
    skills: <SkillsPanel showToast={showToast} />,
    services: <ServicesPanel showToast={showToast} />,
    testimonials: <TestimonialsPanel showToast={showToast} />,
    stats: <StatsPanel showToast={showToast} />,
    about: <AboutPanel showToast={showToast} />,
    messages: (
      <MessagesPanel showToast={showToast} onCountChange={loadCounts} />
    ),
  };

  return (
    <div
      className="min-h-screen text-white flex transition-colors duration-400"
      style={{ backgroundColor: isDark ? "#05050f" : "#eef2ff" }}
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[60] max-w-sm px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl border transition-all ${
            toast.type === "success"
              ? "bg-green-500/15 border-green-500/25 text-green-300"
              : "bg-red-500/15 border-red-500/25 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/6 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              TC
            </div>
            <div>
              <div className="text-white font-bold text-sm">Admin Panel</div>
              <div className="text-gray-600 text-[10px] truncate max-w-[120px]">
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="lg:hidden text-gray-500 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon, badge }) => {
            const badgeCount = badge ? counts[badge] : 0;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebar(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  activeTab === id
                    ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white border border-indigo-500/25"
                    : "text-gray-500 hover:text-white hover:bg-white/4"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={activeTab === id ? "text-indigo-400" : ""}
                  />
                  {label}
                </div>
                {badgeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Seed All + Footer */}
        <div className="px-3 py-4 border-t border-white/6 space-y-2">
          {/* <button
            onClick={seedAll}
            disabled={seedingAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-400 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all disabled:opacity-50"
          >
            {seedingAll ? (
              <>
                <div className="w-3 h-3 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />{" "}
                Seeding…
              </>
            ) : (
              <>
                <FiDatabase size={13} /> Seed All Sample Data
              </>
            )}
          </button> */}
          {/* Theme toggle */}
          {/* <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-gray-500 hover:text-white hover:bg-white/4"
          >
            {isDark ? (
              <FiSun size={16} className="text-yellow-400" />
            ) : (
              <FiMoon size={16} className="text-indigo-400" />
            )}
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button> */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/4 transition-all"
          >
            <FiHome size={16} /> View Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-dark border-b border-white/5 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebar(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/10 text-gray-400 hover:text-white"
          >
            <FiMenu size={18} />
          </button>
          <div>
            <h1 className="text-white font-bold text-base capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <p className="text-gray-600 text-xs hidden sm:block">
              Manage your portfolio {activeTab}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle in top bar */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 rounded-xl flex items-center justify-center glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all hover:scale-105"
            >
              {isDark ? (
                <FiSun size={15} className="text-yellow-400" />
              ) : (
                <FiMoon size={15} className="text-indigo-400" />
              )}
            </button>
            <button
              onClick={loadCounts}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-gray-400 glass border border-white/8 hover:text-white transition-all"
            >
              <FiRefreshCw size={12} /> Refresh
            </button>
            {activeTab === "projects" && (
              <Link
                to="/admin/projects/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <FiPlus size={13} /> New Project
              </Link>
            )}
          </div>
        </header>

        {/* Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {panels[activeTab]}
        </main>
      </div>
    </div>
  );
}
