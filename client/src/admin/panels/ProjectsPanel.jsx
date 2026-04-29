import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiExternalLink,
  FiGithub,
  FiStar,
  FiEye,
  FiDatabase,
} from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import API from "../../utils/api";

const CATEGORY_COLORS = {
  "Web App": "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  Mobile: "bg-cyan-500/15   text-cyan-300   border-cyan-500/25",
  API: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  "UI/UX": "bg-pink-500/15   text-pink-300   border-pink-500/25",
  Other: "bg-gray-500/15   text-gray-400   border-gray-500/25",
};

export default function ProjectsPanel({ showToast, onCountChange }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;
    setDeleting(id);
    try {
      await API.delete(`/projects/${id}`);
      setProjects((p) => p.filter((x) => x._id !== id));
      showToast("Project deleted");
      onCountChange?.();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm("This will REPLACE all projects with 13 previous ones.")
    )
      return;
    setSeeding(true);
    try {
      await API.post("/projects/seed/sample");
      showToast("6 sample projects seeded!");
      await load();
      onCountChange?.();
    } catch {
      showToast("Seeding failed", "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: projects.length },
          {
            label: "Featured",
            value: projects.filter((p) => p.featured).length,
          },
          {
            label: "With Live URL",
            value: projects.filter((p) => p.liveUrl).length,
          },
          {
            label: "Categories",
            value: [...new Set(projects.map((p) => p.category))].length,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="glass border border-white/8 rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-extrabold gradient-text">{value}</div>
            <div className="text-gray-600 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h3 className="text-white font-bold text-sm">
          All Projects ({projects.length})
        </h3>
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
            )}
            Seed Sample
          </button> */}
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <FiPlus size={13} /> Add Project
          </Link>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass border border-white/8 rounded-3xl p-12 text-center">
          <div className="w-7 h-7 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass border border-white/8 rounded-3xl p-16 text-center">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-gray-400 mb-4">No projects yet.</p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/admin/projects/new"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              + Add Project
            </Link>
            {/* <button
              onClick={handleSeed}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-400 glass border border-amber-500/20"
            >
              Seed Sample
            </button> */}
          </div>
        </div>
      ) : (
        <div className="glass border border-white/8 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="text-left px-5 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left px-4 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                    Tech
                  </th>
                  <th className="text-center px-4 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Featured
                  </th>
                  <th className="text-left px-4 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">
                    Metrics
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr
                    key={p._id}
                    className={`border-b border-white/4 hover:bg-white/2 transition-colors ${idx === projects.length - 1 ? "border-none" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              📁
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-gray-600 text-xs line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS.Other}`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(p.technologies || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/8"
                          >
                            {t}
                          </span>
                        ))}
                        {(p.technologies?.length || 0) > 3 && (
                          <span className="text-[10px] text-gray-600">
                            +{p.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      {p.featured ? (
                        <HiBadgeCheck
                          className="text-indigo-400 mx-auto"
                          size={17}
                        />
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="flex gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiStar size={10} className="text-yellow-500" />
                          {p.metrics?.stars || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye size={10} className="text-cyan-500" />
                          {p.metrics?.views || "0"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                          >
                            <FiExternalLink size={13} />
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/8 transition-all"
                          >
                            <FiGithub size={13} />
                          </a>
                        )}
                        <Link
                          to={`/admin/projects/edit/${p._id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                        >
                          <FiEdit2 size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                        >
                          {deleting === p._id ? (
                            <div className="w-3 h-3 border border-t-red-400 border-red-400/30 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={13} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
