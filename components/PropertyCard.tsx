import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/lib/content";

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// Shared home card used by the homes grid and the area landing pages.
export default function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      href={`/homes/${p.slug}`}
      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`/${p.card}`}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
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
          View home &amp; book →
        </span>
      </div>
    </Link>
  );
}
