import Link from "next/link";
import { properties } from "@/lib/content";

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export default function HomesGrid() {
  return (
    <section id="homes" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Our homes</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Find your place on the coast</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          {properties.length} coastal homes and suites — from romantic hideaways for two to family
          houses that sleep ten. Every one comes with a hot tub.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <Link
            key={p.slug}
            href={`/homes/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${p.card}`}
                alt={p.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[var(--sea)]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {p.location}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-[var(--sea)]">{p.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
                <span>Sleeps {p.stats.sleeps}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                <span>{p.stats.bedrooms} bd</span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                <span>{num(p.stats.bathrooms)} ba</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">{p.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--sand-600)] transition group-hover:text-[var(--sea)]">
                View home & book →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
