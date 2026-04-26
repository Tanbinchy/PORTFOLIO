import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../utils/api";

export default function AdminLogin() {
  const { login, token } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → redirect
  useEffect(() => {
    if (token) navigate("/admin/dashboard");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.token, data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-400"
      style={{ backgroundColor: isDark ? "#05050f" : "#eef2ff" }}
    >
      {/* bg blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-400 text-sm mb-8 transition-colors group"
        >
          <FiArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Portfolio
        </Link>

        {/* Card */}
        <div className="glass border border-white/8 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              TC
            </div>
            <div>
              <div className="text-white font-bold">Admin Panel</div>
              <div className="text-gray-500 text-xs">Portfolio Management</div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Sign in to manage your portfolio
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <FiMail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="demo@gmail.com"
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="glass-input w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Hint */}
          {/* <div className="mt-6 p-4 rounded-2xl bg-white/2 border border-white/5">
            <p className="text-gray-600 text-xs text-center">
              Default: <span className="text-gray-400">admin@portfolio.com</span> / <span className="text-gray-400">Admin@1234</span>
            </p>
            <p className="text-gray-700 text-[10px] text-center mt-1">Change these in <code className="text-indigo-500">server/.env</code></p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
