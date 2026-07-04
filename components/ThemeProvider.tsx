"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_ID,
  isThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const themeListeners = new Set<() => void>();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

function readTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored && isThemeId(stored) ? stored : DEFAULT_THEME_ID;
}

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => DEFAULT_THEME_ID
  );

  const setTheme = useCallback((id: ThemeId) => {
    applyTheme(id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
    emitThemeChange();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
