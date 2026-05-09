import React, { useState } from "react";
import {
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiSend,
} from "react-icons/fi";
import { useScrollReveal } from "../hooks/useScrollReveal";
import API from "../utils/api";

const socials = [
  {
    icon: FiGithub,
    href: "https://github.com/Tanbinchy",
    label: "GitHub",
    color: "hover:bg-gray-700/40 hover:border-gray-500/40 hover:text-gray-200",
  },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/ashiful-hoque-chowdhury-704718299/",
    label: "LinkedIn",
    color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-300",
  },
  {
    icon: FiTwitter,
    href: "https://x.com/tanshu_Moni",
    label: "Twitter",
    color: "hover:bg-sky-600/20  hover:border-sky-500/40  hover:text-sky-300",
  },
];

const INITIAL = { name: "", email: "", subject: "", message: "" };
const ERRORS_INIT = {};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Invalid email";
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20)
    errors.message = "Message must be at least 20 characters";
  return errors;
}

export default function Contact() {
  const titleRef = useScrollReveal("reveal", 0);
  const leftRef = useScrollReveal("reveal-left", 0.1);
  const rightRef = useScrollReveal("reveal-right", 0.15);

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState(ERRORS_INIT);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    try {
      const { data } = await API.post("/contact", form);
      setStatus("success");
      setMessage(data.message);
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-4" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Have a project in mind or just want to say hi? My inbox is always
            open — I'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* ── LEFT – form (3 cols) ── */}
          <div ref={leftRef} className="lg:col-span-3">
            <div className="glass border border-white/8 rounded-3xl p-7 sm:p-9">
              {/* Success / Error alert */}
              {status === "success" && (
                <div className="mb-6 px-5 py-4 rounded-2xl bg-green-500/10 border border-green-500/25 text-green-300 text-sm flex items-start gap-3">
                  <span className="text-lg shrink-0">🎉</span>
                  <span>{message}</span>
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-start gap-3">
                  <span className="text-lg shrink-0">❌</span>
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${errors.name ? "border-red-500/50" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${errors.email ? "border-red-500/50" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Let's build something great!"
                    className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${errors.subject ? "border-red-500/50" : ""}`}
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project..."
                    className={`glass-input w-full px-4 py-3 rounded-xl text-sm resize-none ${errors.message ? "border-red-500/50" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend size={15} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT – info (2 cols) ── */}
          <div ref={rightRef} className="lg:col-span-2 flex flex-col gap-5">
            {/* Email card */}
            <a
              href="mailto:tanbinchy@gmail.com"
              className="glass border border-white/8 rounded-3xl p-6 flex items-start gap-4 card-hover group hover:border-indigo-500/30"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                <FiMail size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Email Me
                </div>
                <div className="text-white font-medium text-sm group-hover:gradient-text transition-all">
                  tanbinchy@gmail.com
                </div>
                <div className="text-gray-600 text-xs mt-0.5">
                  Response within 24 hours
                </div>
              </div>
            </a>

            {/* Location card */}
            <div className="glass border border-white/8 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <FiMapPin size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-white font-medium text-sm">
                  North Kattali, Chattogram, Bangladesh
                </div>
                <div className="text-gray-600 text-xs mt-0.5">
                  Open to remote worldwide
                </div>
              </div>
            </div>

            {/* Availability card */}
            <div className="glass border border-green-500/20 rounded-3xl p-6 bg-green-500/4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 font-bold text-sm">
                  Currently Available
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Open to new freelance projects and full-time opportunities.
                Let's discuss how we can work together!
              </p>
            </div>

            {/* Social links */}
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-3 font-semibold">
                Find me on
              </p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl glass border border-white/8 text-gray-400 transition-all duration-300 hover:scale-105 text-xs font-medium ${color}`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:block">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
