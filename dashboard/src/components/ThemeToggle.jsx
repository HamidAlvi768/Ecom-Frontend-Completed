import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../theme";

export const ThemeToggle = () => {
  const [theme, toggleTheme] = useTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label}>
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  );
};
