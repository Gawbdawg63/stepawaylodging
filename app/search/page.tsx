import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { brand, getProperty } from "@/lib/content";
import { searchAvailability, nightsBetween } from "@/lib/ownerrez";

export const metadata: Metadata = {
  title: `Search Availability — ${brand.name}`,
  description: "Search live availability across all Step Away Lodging vacation homes on the Oregon Coast.",
  alternates: { canonical: "/search" },
  robots: { index: false },
};

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function fmt(d?: string) {
  if (!d) return null;
  const date = new Date(d + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
const toMdy = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${m}/${d}/${y}` : iso;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ arrival?: string; departure?: string; adults?: string }>;
}) {
  const { arrival, departure, adults } = await searchParams;
  const guests = adults ?? "2";
  const a = fmt(arrival);
  const d = fmt(departure);
  const summary = a && d ? `${a} → ${d}` : "Choose your dates";
  const nights = arrival && departure ? nightsBetween(arrival, departure) : 0;

  const outcome = await searchAvailability(arrival, departure, Number(guests));
  const rows = outcome.ok ? outcome.rows : [];
  const available = rows.filter((r) => r.available);
  const unavailable = rows.filter((r) => !r.available);

  // Booking deep-link that pre-fills the home's OwnerRez booking widget.
  const bookHref = (slug: string) =>
    arrival && departure
      ? `/homes/${slug}?or_arrival=${toMdy(arrival)}&or_departure=${toMdy(departure)}&or_adults=${guests}#book`
      : `/homes/${slug}#book`;

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
            {arrival && departure ? <span className="text-white/70"> · {guests} guest{Number(guests) > 1 ? "s" : ""}</span> : null}
          </h1>
          <div className="mt-8">
            <SearchBar initialArrival={arrival} initialDeparture={departure} initialGuests={guests} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        {!outcome.ok && outcome.reason === "no_dates" && (
          <p className="text-center text-lg text-[var(--muted)]">Pick your check-in and check-out dates above to see which homes are open.</p>
        )}

        {!outcome.ok && outcome.reason === "not_configured" && (
          <p className="text-center text-[var(--muted)]">Availability search is being set up. Please check back shortly, or browse <Link href="/homes" className="underline">all our homes</Link>.</p>
        )}

        {outcome.ok && (
          <>
            <p className="mb-8 text-center text-[var(--muted)]">
              {available.length > 0
                ? `${available.length} of our ${rows.length} homes ${available.length === 1 ? "is" : "are"} available${nights ? ` for your ${nights}-night stay` : ""}.`
                : "None of our homes are open for those exact dates — try adjusting them above."}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {available.map((r) => {
                const p = getProperty(r.slug);
                if (!p) return null;
                return (
                  <div key={r.slug} className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:shadow-md">
                    <Link href={bookHref(p.slug)} className="group relative block aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/${p.card}`} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--sea)]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur">{p.location}</span>
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-xl text-[var(--sea)]">{p.name}</h3>
                      <div className="mt-1 text-sm text-[var(--muted)]">Sleeps {p.stats.sleeps} · {p.stats.bedrooms} bd · {num(p.stats.bathrooms)} ba</div>
                      {r.total != null && (
                        <div className="mt-3">
                          <span className="font-display text-2xl text-[var(--sea)]">{money(r.total)}</span>
                          <span className="text-sm text-[var(--muted)]"> total{nights ? ` · ${nights} nights` : ""}</span>
                        </div>
                      )}
                      <Link href={bookHref(p.slug)} className="mt-4 inline-block rounded-full bg-[var(--sand)] px-6 py-2.5 text-center font-semibold text-white transition hover:bg-[var(--sand-600)]">
                        Book this home
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {unavailable.length > 0 && available.length > 0 && (
              <p className="mt-10 text-center text-sm text-[var(--muted)]">
                Booked for these dates: {unavailable.map((r) => getProperty(r.slug)?.name).filter(Boolean).join(", ")}.
              </p>
            )}
          </>
        )}
      </section>

      <Footer subtitle={brand.tagline} />
    </div>
  );
}
