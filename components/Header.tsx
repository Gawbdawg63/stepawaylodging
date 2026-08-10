"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/content";

const links = [
  { href: "#gallery", label: "Photos" },
  { href: "#about", label: "The Home" },
  { href: "#amenities", label: "Amenities" },
  { href: "#area", label: "The Area" },
  { href: "#owners", label: "For Owners" },
  { href: "#book", label: "Book" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--sea)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--sea)]/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center leading-none text-white">
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/${brand.logo}`}
              alt={brand.name}
              style={{ width: brand.logoWidth }}
              className="h-auto"
            />
          ) : (
            <span className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-wide">
                {brand.name}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                Ocean Peak Ridge
              </span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.slice(0, -1).map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/85 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#book"
            className="rounded-full bg-[var(--sand)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]"
          >
            Check availability
          </a>
        </nav>

        <button
          aria-label="Menu"
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--sea)]/98 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-white/90 transition hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
