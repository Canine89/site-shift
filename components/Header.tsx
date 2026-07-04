"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AUTHOR_PROPOSAL_FORM_URL } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/books", label: "출간 도서" },
  { href: "/about", label: "출판사 소개" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled || menuOpen
          ? "bg-void border-b border-carbon"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/shift-logo-white.png"
            alt="시프트"
            width={72}
            height={21}
            priority
          />
          <span className="eyebrow text-steel hidden sm:inline">
            SHIFT BOOKS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-body-sm font-medium transition-opacity ${
                pathname === link.href
                  ? "text-paper"
                  : "text-steel hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <a
            href={AUTHOR_PROPOSAL_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
          >
            집필 제안
          </a>
        </div>

        <button
          type="button"
          className="hidden max-md:inline-flex items-center gap-2 px-3 py-2 text-body-sm font-medium text-paper opacity-85 hover:opacity-100 transition-opacity"
          aria-expanded={menuOpen}
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "닫기" : "메뉴"}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-void border-t border-carbon px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`text-body font-medium ${
                pathname === link.href ? "text-paper" : "text-steel"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={AUTHOR_PROPOSAL_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill w-fit"
          >
            집필 제안
          </a>
        </nav>
      )}
    </header>
  );
}
