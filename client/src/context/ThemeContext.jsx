import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("portfolioTheme");
    return stored ? stored === "dark" : true; // default dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.removeAttribute("data-theme");
      html.classList.remove("light-mode");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.add("light-mode");
    }
    localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
