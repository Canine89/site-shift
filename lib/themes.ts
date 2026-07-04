export const THEME_STORAGE_KEY = "shift-theme";

export const THEME_IDS = ["blue", "ink", "forest", "wine", "slate"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type ThemeColors = {
  void: string;
  carbon: string;
  graphite: string;
  steel: string;
  ash: string;
  paper: string;
};

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  colors: ThemeColors;
};

/** 각 테마 — 5-chip 팔레트 (void → paper) */
export const THEMES: ThemeDefinition[] = [
  {
    id: "blue",
    label: "블루",
    colors: {
      void: "#2a5078",
      carbon: "#6587a5",
      graphite: "#848996",
      steel: "#dbe4eb",
      ash: "#dbe4eb",
      paper: "#ffffff",
    },
  },
  {
    id: "ink",
    label: "잉크",
    colors: {
      void: "#000000",
      carbon: "#1c1c1c",
      graphite: "#4d4d4d",
      steel: "#808080",
      ash: "#ababab",
      paper: "#ffffff",
    },
  },
  {
    id: "forest",
    label: "포레스트",
    colors: {
      void: "#1a3328",
      carbon: "#2d5a47",
      graphite: "#5c7a6a",
      steel: "#b8cfc4",
      ash: "#c9ddd3",
      paper: "#f4faf7",
    },
  },
  {
    id: "wine",
    label: "와인",
    colors: {
      void: "#3a1f2e",
      carbon: "#6b3a52",
      graphite: "#8a6678",
      steel: "#dcc9d2",
      ash: "#e8d8df",
      paper: "#faf6f8",
    },
  },
  {
    id: "slate",
    label: "슬레이트",
    colors: {
      void: "#1e2936",
      carbon: "#3d5166",
      graphite: "#64748b",
      steel: "#cbd5e1",
      ash: "#d8e0ea",
      paper: "#f8fafc",
    },
  },
];

export const DEFAULT_THEME_ID: ThemeId = "blue";

export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
