import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "green-api-tg-theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useTheme = create<ThemeState>()((set, get) => {
  const initial = getInitialTheme();
  applyTheme(initial);

  return {
    theme: initial,
    toggleTheme: () => {
      const theme: Theme = get().theme === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
      set({ theme });
    },
  };
});
