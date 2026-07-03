"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

const SLOGAN = "또 다른 나, 더 나은 나를 발견하는 시간";

/**
 * 히어로 슬로건 Lottie 타이틀 (public/lottie/hero-title.json).
 * 두 줄이 마스크 아래에서 떠오르고, 점선 밑줄이 그려진 뒤 주석 점이 찍힌다.
 */
export default function HeroTitleLottie() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let anim: AnimationItem | undefined;
    let cancelled = false;

    Promise.all([import("lottie-web"), document.fonts.ready]).then(
      ([mod]) => {
        if (cancelled || !container) return;
        anim = mod.default.loadAnimation({
          container,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/lottie/hero-title.json",
        });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          anim.addEventListener("DOMLoaded", () => {
            anim?.goToAndStop(anim.totalFrames - 1, true);
          });
        }
      }
    );

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  return (
    <div className="w-full max-w-[720px]">
      <h1 className="sr-only">{SLOGAN}</h1>
      <div
        ref={containerRef}
        aria-hidden
        className="w-full aspect-[900/280]"
      />
    </div>
  );
}
