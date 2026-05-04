/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FiArrowDown, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import API from "../utils/api";

const roles = [
  "Full Stack Developer",
  "UI/UX Designer",
  "React Specialist",
  "API Architect",
];

export default function Hero() {
  const [about, setAbout] = useState(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    API.get("/about")
      .then(({ data }) => setAbout(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  const socials = [
    {
      icon: FiGithub,
      href: about?.githubUrl || "https://github.com",
      label: "GitHub",
    },
    {
      icon: FiLinkedin,
      href: about?.linkedinUrl || "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: FiTwitter,
      href: about?.twitterUrl || "https://twitter.com",
      label: "Twitter",
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[80px]" />
      </div>
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div
            className="text-center lg:text-left order-2 lg:order-1"
            style={{ animation: "fadeInUp .8s ease forwards" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              <span
                className={`w-2 h-2 rounded-full ${about?.available !== false ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
              />
              {about?.available !== false
                ? "Available for freelance work"
                : "Not currently available"}
              <HiSparkles className="text-yellow-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-[1.08] tracking-tight">
              <span className="text-white">Hi, I'm</span>
              <br />
              <span className="gradient-text">
                {about?.name || "Ashiful Hoque Chowdhury Tanbin"}
              </span>
            </h1>

            <div className="h-9 flex items-center justify-center lg:justify-start mb-5">
              <span className="text-xl sm:text-2xl font-semibold text-gray-300">
                {displayed}
                <span className="inline-block w-0.5 h-6 bg-indigo-400 ml-1 animate-pulse align-middle" />
              </span>
            </div>

            <p className="text-gray-500 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 text-base">
              I craft beautiful, high-performance web applications using modern
              tech stacks. Turning complex ideas into elegant, user-friendly
              digital experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                View My Work →
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-full font-semibold text-white glass border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                Let's Talk
              </a>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <span className="text-gray-600 text-xs uppercase tracking-widest">
                Follow
              </span>
              <div className="w-8 h-px bg-gray-700" />
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="flex justify-center order-1 lg:order-2"
            style={{ animation: "fadeInUp .8s .2s ease both" }}
          >
            <div className="relative">
              <div
                className="gradient-border rounded-3xl p-[2px]"
                style={{ borderRadius: "1.75rem" }}
              >
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-[calc(1.75rem-2px)] overflow-hidden bg-[#0d0d1a]">
                  <img
                    src={about?.profileImage || "/profile.jpeg"}
                    alt={about?.name}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>
              <div className="absolute -top-0 -right-4 glass border border-white/10 rounded-2xl px-3 py-1.5 text-xs font-semibold text-white shadow-xl animate-float">
                ⚛️ <span className="gradient-text">React Expert</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass border border-white/10 rounded-2xl px-3 py-1.5 text-xs font-semibold text-white shadow-xl animate-float-delayed">
                🚀 <span className="gradient-text">Full Stack</span>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 blur-2xl -z-10 scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce-slow">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <FiArrowDown size={16} />
      </div> */}
    </section>
  );
}
