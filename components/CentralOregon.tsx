import { centralOregon as c } from "@/lib/content";

export default function CentralOregon() {
  return (
    <section id="central-oregon" className="relative overflow-hidden">
      {/* Bend / Smith Rock photo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bend.jpg')" }} />
      {/* Dark overlay for legible text */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(11,42,43,0.62) 0%, rgba(11,42,43,0.42) 38%, rgba(11,42,43,0.80) 100%)" }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-3xl px-5 pt-32 pb-24 text-center text-white sm:pt-36 sm:pb-28">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f6c47e]">{c.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{c.heading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">{c.body}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {c.places.map((p) => (
            <span key={p} className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              {p}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/20 bg-black/25 p-6 backdrop-blur sm:p-8">
          <p className="font-display text-xl text-white sm:text-2xl">{c.ownerLine}</p>
          <p className="mt-2 text-sm text-white/80">
            We&apos;re onboarding a first group of homes now. Tell us about yours and we&apos;ll be in touch.
          </p>
          <a
            href="#owners"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--sand)] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[var(--sand-600)]"
          >
            {c.ctaLabel}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
