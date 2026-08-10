import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCover from "@/components/EventCover";
import JsonLd from "@/components/JsonLd";
import { events, getEvent } from "@/lib/events";
import { brand } from "@/lib/content";
import { abs } from "@/lib/seo";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) return { title: brand.name };
  return {
    title: `${e.title} — Lincoln City | ${brand.name}`,
    description: e.excerpt,
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { title: e.title, description: e.excerpt, url: `/events/${e.slug}`, type: "article" },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.excerpt,
    ...(e.yearRound ? {} : { startDate: undefined }),
    eventSchedule: e.dateLabel,
    location: { "@type": "Place", name: e.location, address: { "@type": "PostalAddress", addressLocality: "Lincoln City", addressRegion: "OR", addressCountry: "US" } },
    url: abs(`/events/${e.slug}`),
    organizer: { "@type": "Organization", name: "Explore Lincoln City", url: "https://www.explorelincolncity.com" },
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      <Header />

      <article>
        {/* Cover */}
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          <EventCover event={e} className="h-full w-full" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,42,43,0.55) 0%, rgba(11,42,43,0.15) 40%, rgba(11,42,43,0.65) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-10 text-white">
            <Link href="/events" className="text-sm text-white/80 transition hover:text-white">← All events</Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">{e.category}</p>
            <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl">{e.title}</h1>
          </div>
        </div>

        {/* Meta + body */}
        <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <div className="mb-8 flex flex-wrap gap-x-8 gap-y-2 border-b border-[var(--border)] pb-6 text-sm">
            <div>
              <div className="font-semibold uppercase tracking-wide text-[var(--sand-600)]">When</div>
              <div className="mt-1 text-[var(--foreground)]/90">{e.dateLabel}</div>
            </div>
            <div>
              <div className="font-semibold uppercase tracking-wide text-[var(--sand-600)]">Where</div>
              <div className="mt-1 text-[var(--foreground)]/90">{e.location}</div>
            </div>
          </div>

          <div className="space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
            {e.body.map((para, i) => <p key={i}>{para}</p>)}
          </div>

          {/* Book CTA */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-7 text-center shadow-sm">
            <h2 className="font-display text-2xl text-[var(--sea)]">Make a weekend of it</h2>
            <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">
              Stay in one of our coastal homes — steps from the beach and the action.
            </p>
            <Link href="/homes" className="mt-5 inline-block rounded-full bg-[var(--sand)] px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]">
              Browse our homes
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            Dates can change — confirm on the official{" "}
            <a href="https://www.explorelincolncity.com/events/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--sea)]">Explore Lincoln City</a> calendar.
          </p>
        </div>
      </article>

      <Footer subtitle="Lincoln City events on the Oregon Coast" />
    </div>
  );
}
