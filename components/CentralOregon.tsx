import { centralOregon as c } from "@/lib/content";

// Decorative star positions (percent) for the dusk sky.
const stars = [
  [8, 14], [16, 26], [24, 10], [33, 22], [44, 12], [58, 20], [67, 9],
  [76, 24], [85, 15], [92, 28], [12, 34], [50, 30], [72, 34], [30, 38], [88, 40],
];

export default function CentralOregon() {
  return (
    <section id="central-oregon" className="relative overflow-hidden">
      {/* Dusk sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c2733 0%, #143a4a 16%, #34324f 38%, #7d4a56 58%, #c07b45 73%, #93502f 83%, #221826 100%)",
        }}
      />
      {/* Setting sun glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[56%] h-[42vw] max-h-[420px] w-[42vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(246,196,126,0.95) 0%, rgba(232,150,88,0.55) 26%, rgba(232,150,88,0) 62%)",
        }}
      />
      {/* Stars */}
      {stars.map(([x, y], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${x}%`, top: `${y}%`, width: i % 3 ? 2 : 3, height: i % 3 ? 2 : 3, opacity: 0.5 + (i % 3) * 0.15 }}
        />
      ))}

      {/* Layered Cascade silhouettes at the base */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[46%] w-full"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,140 L120,90 L260,132 L400,68 L560,120 L700,58 L860,112 L1020,74 L1180,122 L1320,78 L1440,120 L1440,260 L0,260 Z" fill="#463f5c" opacity="0.85" />
        <path d="M0,192 L160,150 L300,186 L460,138 L620,182 L780,150 L940,186 L1100,144 L1260,186 L1440,158 L1440,260 L0,260 Z" fill="#2b2540" />
        <path d="M0,232 L200,206 L380,232 L560,200 L760,234 L960,206 L1160,234 L1360,208 L1440,228 L1440,260 L0,260 Z" fill="#161019" />
      </svg>

      {/* Content */}
      <div className="relative mx-auto max-w-3xl px-5 pt-24 pb-44 text-center text-white sm:pt-28 sm:pb-52">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f6c47e]">{c.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{c.heading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{c.body}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {c.places.map((p) => (
            <span key={p} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              {p}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-8">
          <p className="font-display text-xl text-white sm:text-2xl">{c.ownerLine}</p>
          <p className="mt-2 text-sm text-white/75">
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
