import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import OwnerRezWidget from "@/components/OwnerRezWidget";
import { brand, searchWidget } from "@/lib/content";

export const metadata: Metadata = {
  title: `Search Availability — ${brand.name}`,
  description: "Search live availability across all Step Away Lodging vacation homes on the Oregon Coast.",
  alternates: { canonical: "/search" },
  robots: { index: false }, // results page — keep it out of the index
};

function fmt(d?: string) {
  if (!d) return null;
  const date = new Date(d + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ or_arrival?: string; or_departure?: string; or_adults?: string }>;
}) {
  const { or_arrival: arrival, or_departure: departure, or_adults: guests } = await searchParams;
  const a = fmt(arrival);
  const d = fmt(departure);
  const summary = a && d ? `${a} → ${d}` : a ? `From ${a}` : "Choose your dates";

  return (
    <div>
      <Header />

      {/* Search header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0b2a2b 0%, var(--sea-700) 45%, var(--sea) 100%)" }} />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-32 text-center text-white sm:pt-36">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--sand)]">Find your stay</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            {summary}
            {guests ? <span className="text-white/70"> · {guests} guest{Number(guests) > 1 ? "s" : ""}</span> : null}
          </h1>
          <div className="mt-8">
            <SearchBar initialArrival={arrival} initialDeparture={departure} initialGuests={guests ?? "2"} />
          </div>
        </div>
      </section>

      {/* Live availability across all homes */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-8">
          <p className="mb-4 text-center text-sm text-[var(--muted)]">
            Live availability for all {`${""}`}homes — pick your dates below to see what&apos;s open, then book direct.
          </p>
          <OwnerRezWidget widget={searchWidget} />
        </div>
      </section>

      <Footer subtitle={brand.tagline} />
    </div>
  );
}
