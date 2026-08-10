"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/content";

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((o) => (o === null ? o : (o - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Gallery</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Take a look around</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Tap any photo to view it larger.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {photos.map((p, i) => (
          <button
            key={p.file}
            onClick={() => setOpen(i)}
            className={`group relative cursor-zoom-in overflow-hidden rounded-2xl ${
              i === 0 && photos.length > 1 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
            aria-label={`View ${p.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/${p.file}`} alt={p.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20">×</button>
          {photos.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:left-6">‹</button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${photos[open].file}`}
            alt={photos[open].alt}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:right-6">›</button>
          )}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {open + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
