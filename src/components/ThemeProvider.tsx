"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "cornerman-theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function readPreferredTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The server and the first client render must agree. The pre-hydration
  // script has already painted the preferred document theme; this state is
  // synchronized immediately after React hydrates.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncPreferredTheme = () => {
      const next = readPreferredTheme();
      applyTheme(next);
      setThemeState(next);
    };

    const syncSystemTheme = () => {
      if (readStoredTheme() === null) syncPreferredTheme();
    };

    syncPreferredTheme();
    media.addEventListener("change", syncSystemTheme);
    window.addEventListener("storage", syncPreferredTheme);

    return () => {
      media.removeEventListener("change", syncSystemTheme);
      window.removeEventListener("storage", syncPreferredTheme);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const appliedTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(appliedTheme === "light" ? "dark" : "light");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
