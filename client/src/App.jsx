import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Portfolio
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Skills       from './components/Skills';
import Projects     from './components/Projects';
import Services     from './components/Services';
import Testimonials from './components/Testimonials';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

// Admin
import AdminLogin     from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProjectForm    from './admin/ProjectForm';
import ProtectedRoute from './admin/ProtectedRoute';

function PortfolioPage() {
  const { isDark } = useTheme();
  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-400"
      style={{ backgroundColor: isDark ? '#05050f' : '#eef2ff', color: isDark ? '#f1f5f9' : '#1e1b4b' }}
    >
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/projects/new" element={
              <ProtectedRoute><ProjectForm /></ProtectedRoute>
            } />
            <Route path="/admin/projects/edit/:id" element={
              <ProtectedRoute><ProjectForm /></ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
