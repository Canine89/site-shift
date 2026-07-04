"use client";

import { useRef } from "react";
import { getTheme, THEMES } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";

type ThemePickerProps = {
  className?: string;
};

/** 푸터용 — 닫히면 현재 색상명만, 펼치면 선택 */
export default function ThemePicker({ className = "" }: ThemePickerProps) {
  const { theme, setTheme } = useTheme();
  const current = getTheme(theme);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const choose = (id: (typeof THEMES)[number]["id"]) => {
    setTheme(id);
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details ref={detailsRef} className={`group relative text-caption ${className}`}>
      <summary
        className="cursor-pointer list-none text-graphite transition-colors hover:text-steel [&::-webkit-details-marker]:hidden"
        aria-label="색상 선택"
      >
        <span className="eyebrow text-graphite group-open:hidden">색상</span>
        <span className="eyebrow text-steel hidden group-open:inline">
          색상 선택
        </span>
        <span className="ml-2 text-steel group-open:hidden">{current.label}</span>
      </summary>
      <ul
        className="absolute bottom-full right-0 mb-2 min-w-[7.5rem] border border-carbon bg-void py-2"
        role="listbox"
        aria-label="색상"
      >
        {THEMES.map((item) => (
          <li key={item.id} role="option" aria-selected={theme === item.id}>
            <button
              type="button"
              onClick={() => choose(item.id)}
              className={`block w-full px-3 py-1.5 text-left text-caption transition-colors cursor-pointer ${
                theme === item.id
                  ? "text-paper"
                  : "text-graphite hover:text-ash"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
