import React, { useState, useEffect, useCallback } from "react";
import {
  FiExternalLink,
  FiGithub,
  FiStar,
  FiGitBranch,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useScrollReveal } from "../hooks/useScrollReveal";
import API from "../utils/api";

const FILTERS = ["All", "Web App", "Mobile", "API", "UI/UX", "Other"];

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&q=80";

const CARDS_PER_PAGE = 6;

function ProjectCard({ project }) {
  return (
    <div className="glass border border-white/8 rounded-3xl overflow-hidden card-hover group glow-hover flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-900 shrink-0">
        <img
          src={project.imageUrl || PLACEHOLDER_IMG}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMG;
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-transparent to-transparent" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <HiBadgeCheck size={11} /> Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-gray-200 backdrop-blur-sm text-black text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
          {project.category}
        </div>

        {/* Links overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={17} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-violet-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={17} />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-2 group-hover:gradient-text transition-all line-clamp-1">
          {project.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.technologies || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/8">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <FiStar size={11} className="text-yellow-400" />
            {project.metrics?.stars ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <FiGitBranch size={11} className="text-green-400" />
            {project.metrics?.forks ?? 0}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <FiEye size={11} className="text-cyan-400" />
            {project.metrics?.views ?? "0"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const titleRef = useScrollReveal("reveal", 0);

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
      setFiltered(data);
    } catch (err) {
      setError("Could not load projects. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Apply filter
  useEffect(() => {
    setPage(0);
    if (activeFilter === "All") {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter((p) => p.category === activeFilter));
    }
  }, [activeFilter, projects]);

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginated = filtered.slice(
    page * CARDS_PER_PAGE,
    (page + 1) * CARDS_PER_PAGE,
  );

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={titleRef} className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            My Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-4" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            A curated collection of projects I've built — from full-stack web
            apps to mobile experiences.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === f
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25"
                  : "glass border border-white/8 text-gray-400 hover:text-white hover:border-indigo-500/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass border border-white/8 rounded-3xl h-80 animate-pulse"
              >
                <div className="h-48 bg-white/4 rounded-t-3xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/4 rounded-full w-3/4" />
                  <div className="h-3 bg-white/4 rounded-full" />
                  <div className="h-3 bg-white/4 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white glass border border-white/10 hover:border-indigo-500/40 transition-all"
            >
              <FiRefreshCw size={15} /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗂️</div>
            <p className="text-gray-400">
              No projects found for <strong>{activeFilter}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginated.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-indigo-500/40"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === page
                          ? "w-6 h-3 bg-gradient-to-r from-indigo-500 to-violet-500"
                          : "w-3 h-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-indigo-500/40"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Admin shortcut */}
        <div className="text-center mt-12">
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-400 text-xs font-medium transition-colors"
          >
            🔧 Manage Projects in Admin Dashboard →
          </a>
        </div>
      </div>
    </section>
  );
}
