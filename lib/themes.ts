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
      carbon: "#3d5f85",
      graphite: "#a3adba",
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
      graphite: "#737373",
      steel: "#9a9a9a",
      ash: "#bcbcbc",
      paper: "#ffffff",
    },
  },
  {
    id: "forest",
    label: "포레스트",
    colors: {
      void: "#1a3328",
      carbon: "#234a39",
      graphite: "#7a9a89",
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
      carbon: "#4c2a3c",
      graphite: "#9a7688",
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
      carbon: "#2c3d4f",
      graphite: "#7688a0",
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
