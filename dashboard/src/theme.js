// Light/dark theme.
// The theme is a data-theme attribute on <html>; App.css defines the colors for each.
// A user's choice is saved in localStorage. Until they choose, the app follows the
// operating system's light/dark setting (and changes with it).
// public/index.html applies the theme before React loads, so there's no white flash.
import { useEffect, useState } from "react";

const KEY = "theme";
const media = () => window.matchMedia?.("(prefers-color-scheme: dark)");

export const getSavedTheme = () => {
  try {
    const t = localStorage.getItem(KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
};

export const getSystemTheme = () => (media()?.matches ? "dark" : "light");

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || getSavedTheme() || getSystemTheme()
  );

  useEffect(() => applyTheme(theme), [theme]);

  // Follow the system setting while the user hasn't picked a theme themselves
  useEffect(() => {
    const mq = media();
    if (!mq) return undefined;
    const onChange = (e) => {
      if (!getSavedTheme()) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // storage blocked: the theme still changes for this visit
    }
    setTheme(next);
  };

  return [theme, toggleTheme];
}
