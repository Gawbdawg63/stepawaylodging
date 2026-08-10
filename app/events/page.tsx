import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import EventCover from "@/components/EventCover";
import { eventsByDate } from "@/lib/events";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `Lincoln City Events — ${brand.name}`,
  description:
    "A year-round guide to Lincoln City events on the Oregon Coast — kite festivals, glass float drops, pow-wows, and more. Plan your stay around them.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <div>
      <Header />
      <PageHero
        eyebrow="On the Oregon Coast"
        title="Lincoln City Events"
        subtitle="From giant kites to glass-float hunts, there's something happening on the coast all year. Plan your stay around the ones you love."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventsByDate.map((e) => (
            <Link
              key={e.slug}
              href={`/events/${e.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <EventCover event={e} className="h-44 w-full" />
              <div className="flex flex-1 flex-col p-5">
                <div className="text-sm font-semibold text-[var(--sand-600)]">{e.dateLabel}</div>
                <h2 className="mt-1 font-display text-xl text-[var(--sea)]">{e.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--foreground)]/80">{e.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-[var(--sand-600)] transition group-hover:text-[var(--sea)]">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-[var(--muted)]">
          Dates can shift year to year — always confirm on the official{" "}
          <a href="https://www.explorelincolncity.com/events/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--sea)]">
            Explore Lincoln City
          </a>{" "}
          calendar before you travel.
        </p>
      </section>

      <Footer subtitle="Lincoln City events on the Oregon Coast" />
    </div>
  );
}
