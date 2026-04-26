import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-400"
        style={{ backgroundColor: isDark ? '#05050f' : '#f0f4ff' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
