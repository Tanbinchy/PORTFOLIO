import React, { useEffect, useState } from "react";
import { FiAward, FiBriefcase, FiUsers, FiCode } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import API from "../utils/api";

const statIconMap = [FiAward, FiBriefcase, FiUsers, FiCode];
const statColorMap = ["indigo", "violet", "cyan", "emerald"];

const colorClasses = {
  indigo:
    "from-indigo-500/20 to-indigo-600/10 border-indigo-500/25 text-indigo-400",
  violet:
    "from-violet-500/20 to-violet-600/10 border-violet-500/25 text-violet-400",
  cyan: "from-cyan-500/20   to-cyan-600/10   border-cyan-500/25   text-cyan-400",
  emerald:
    "from-emerald-500/20 to-emerald-600/10 border-emerald-500/25 text-emerald-400",
};

export default function About() {
  const titleRef = useScrollReveal("reveal", 0);
  const leftRef = useScrollReveal("reveal-left", 0.1);
  const rightRef = useScrollReveal("reveal-right", 0.15);
  const statsRef = useStaggerReveal(".stagger-item", 0.1);
  const badgesRef = useScrollReveal("reveal", 0.25);

  const [about, setAbout] = useState(null);
  const [stats, setStats] = useState([]);
  const [projectsCount, setProjectsCount] = useState(null);

  useEffect(() => {
    API.get("/about")
      .then(({ data }) => setAbout(data))
      .catch(() => {});
    API.get("/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {});
    // Pull real project count directly from the projects collection
    API.get("/projects")
      .then(({ data }) => setProjectsCount(data.length))
      .catch(() => {});
  }, []);

  // Inject real count into whichever stat label contains "project"
  const resolvedStats = stats.map((s) =>
    s.label.toLowerCase().includes("project") && projectsCount !== null
      ? { ...s, value: `${projectsCount}+` }
      : s,
  );

  const displayStats =
    resolvedStats.length > 0
      ? resolvedStats
      : [
          {
            value: projectsCount !== null ? `${projectsCount}+` : "50+",
            label: "Projects Done",
          },
          { value: "30+", label: "Happy Clients" },
          { value: "3+", label: "Years Exp." },
          { value: "99%", label: "Satisfaction" },
        ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Get To Know Me
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-16">
          {/* LEFT */}
          <div ref={leftRef}>
            <h3 className="text-2xl font-bold text-white mb-4">
              {about?.tagline || "Passionate developer building the"}&nbsp;
              <span className="gradient-text">future of the web</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-5 text-[0.95rem]">
              {about?.bio1 ||
                "I'm a Full Stack Developer with over 3 years of experience designing and building web applications that are fast, scalable, and delightful to use."}
            </p>
            <p className="text-gray-500 leading-relaxed mb-8 text-[0.95rem]">
              {about?.bio2 ||
                "When I'm not coding, I'm contributing to open-source projects, writing technical articles, and exploring the latest in web performance and design systems."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
              {[
                ["Name", about?.name || "Ashiful Hoque Chowdhury Tanbin"],
                [
                  "Location",
                  about?.location || "North Kattali, Chattogram, Bangladesh",
                ],
                ["Email", about?.email || "tanbinchy@gmail.com"],
                [
                  "Freelance",
                  about?.available !== false ? "Available" : "Unavailable",
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 items-start">
                  <span className="text-gray-600 shrink-0">{k}:</span>
                  <span
                    className={`font-medium truncate ${
                      k === "Freelance"
                        ? about?.available !== false
                          ? "text-green-500"
                          : "text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={about?.resumeUrl || "./resume.pdf"}
              download
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <HiDownload size={17} /> Download Resume
            </a>
          </div>

          {/* RIGHT */}
          <div ref={rightRef}>
            {/* Stats grid — "Projects Done" uses real count from DB */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4 mb-10">
              {displayStats.map((s, i) => {
                const Icon = statIconMap[i % statIconMap.length];
                const color = statColorMap[i % statColorMap.length];
                return (
                  <div
                    key={s._id || i}
                    className={`stagger-item glass glass-hover card-hover border rounded-2xl p-5 bg-gradient-to-br ${colorClasses[color]}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${colorClasses[color]}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-0.5">
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech badges from DB */}
            <div ref={badgesRef}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-semibold">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {(about?.techBadges?.length > 0
                  ? about.techBadges
                  : [
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Node.js",
                      "Express",
                      "MongoDB",
                      "PostgreSQL",
                      "Tailwind CSS",
                      "Docker",
                      "AWS",
                      "GraphQL",
                      "Redis",
                      "React Native",
                      "Figma",
                      "Git",
                    ]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold glass border border-white/8 text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/8 transition-all duration-200 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
