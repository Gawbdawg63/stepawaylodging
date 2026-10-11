import Link from "next/link";
import { brand } from "@/lib/content";

// Nudge travelers with near-term plans to check open dates or reach out —
// a simple way to fill gaps in the calendar.
export default function LastMinute() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-sm sm:flex-row sm:p-10 sm:text-left">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Getaway soon?</p>
            <h2 className="mt-2 font-display text-2xl text-[var(--sea)] sm:text-3xl">Last-minute openings on the coast</h2>
            <p className="mt-3 text-[var(--muted)]">
              Search your dates to see what&apos;s open this week &mdash; or call or text us and we&apos;ll help you find the right home, fast.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <Link href="/homes#search" className="whitespace-nowrap rounded-full bg-[var(--sea)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--sea-700)]">
              See open dates
            </Link>
            <span className="text-sm text-[var(--muted)]">or text us: {brand.phone}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
