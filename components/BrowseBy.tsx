import Link from "next/link";
import { areas } from "@/lib/areas";
import { collections } from "@/lib/collections";

// Internal-linking section that surfaces the area + topic landing pages.
// Placed on high-traffic pages so Google (and guests) discover them.
export default function BrowseBy() {
  const byArea = areas.map((a) => ({ href: `/${a.slug}`, label: `${a.name} rentals` }));
  const byType = collections.map((c) => ({ href: `/${c.slug}`, label: `${c.name} rentals` }));

  return (
    <section className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Find your perfect stay</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Browse our homes</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg text-[var(--sea)]">By area</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {byArea.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--sea)] transition hover:border-[var(--sea)]">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg text-[var(--sea)]">By type</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {byType.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--sea)] transition hover:border-[var(--sea)]">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
