import Link from "next/link";
import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import OwnerRezWidget from "@/components/OwnerRezWidget";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import type { Property } from "@/lib/content";
import { getReviews, reviewMatchesHome } from "@/lib/reviews";

function Icon({ name }: { name: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "wave":
      return <svg {...common}><path d="M2 12c2 0 2-1.5 4-1.5S8 12 10 12s2-1.5 4-1.5S16 12 18 12s2-1.5 4-1.5" /><path d="M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5S16 17 18 17s2-1.5 4-1.5" /></svg>;
    case "path":
      return <svg {...common}><path d="M12 21s-6-5.5-6-10a6 6 0 1 1 12 0c0 4.5-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></svg>;
    case "fire":
      return <svg {...common}><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.5.5-2.5 1-3 .3 1 1 1.5 1.5 1.5C9 9 12 7 12 3Z" /></svg>;
    case "paw":
      return <svg {...common}><path d="M5 12a4 4 0 0 1 4-1.5h6A4 4 0 0 1 19 12c1 2-1 5-4 5h-6c-3 0-5-3-4-5Z" /><circle cx="8" cy="7" r="1.4" /><circle cx="16" cy="7" r="1.4" /><circle cx="5" cy="10" r="1.2" /><circle cx="19" cy="10" r="1.2" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

// Format bathrooms like "3.5" without a trailing ".0".
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

const propertyLinks = [
  { href: "#gallery", label: "Photos" },
  { href: "#about", label: "The Home" },
  { href: "#book", label: "Book" },
];

export default async function PropertyPage({ property }: { property: Property }) {
  const { stats } = property;
  const heroPhoto = property.photos[0]?.file ?? property.card;

  const { average, count, reviews } = await getReviews();
  const homeReviews = reviews.filter((r) => reviewMatchesHome(r.property, property.name));

  return (
    <div id="top">
      <Header links={propertyLinks} cta={{ href: "#book", label: "Check availability" }} eyebrow={property.name} />

      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/${heroPhoto}')` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(11,42,43,0.74) 0%, rgba(15,56,57,0.55) 45%, rgba(20,73,74,0.74) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">
          <Link href="/#homes" className="mb-4 inline-block text-sm text-white/70 transition hover:text-white">← All homes</Link>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-white/70">{property.location}</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">{property.name}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">{property.headline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span>Sleeps {stats.sleeps}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{stats.bedrooms} {stats.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{num(stats.bathrooms)} bath{stats.bathrooms === 1 ? "" : "s"}</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#book" className="rounded-full bg-[var(--sand)] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[var(--sand-600)]">Check availability</a>
            <a href="#gallery" className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10">See the home</a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Welcome to {property.name}</p>
        <div className="mt-5 space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {property.description.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {property.highlights && property.highlights.length > 0 && (
        <section className="border-y border-[var(--border)] bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
            {property.highlights.map((h) => (
              <div key={h.title} className="text-center sm:text-left">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sea-100)] text-[var(--sea)] sm:mx-0"><Icon name={h.icon} /></div>
                <h3 className="font-display text-xl text-[var(--sea)]">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{h.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      <Gallery photos={property.photos} />

      {/* ABOUT */}
      <section id="about" className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-24 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">The home</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Room to slow down</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-[var(--foreground)]/90">
              {property.description.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className="mt-8 flex gap-8">
              <div><div className="font-display text-3xl text-[var(--sea)]">{stats.sleeps}</div><div className="text-xs uppercase tracking-wide text-[var(--muted)]">Guests</div></div>
              <div><div className="font-display text-3xl text-[var(--sea)]">{stats.bedrooms}</div><div className="text-xs uppercase tracking-wide text-[var(--muted)]">Bedrooms</div></div>
              <div><div className="font-display text-3xl text-[var(--sea)]">{num(stats.bathrooms)}</div><div className="text-xs uppercase tracking-wide text-[var(--muted)]">Baths</div></div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${property.photos[Math.min(1, property.photos.length - 1)]?.file ?? property.card}`}
            alt={`${property.name}`}
            className="min-h-[320px] w-full rounded-3xl border border-[var(--border)] object-cover"
          />
        </div>
      </section>

      {/* AMENITIES */}
      {property.amenities && property.amenities.length > 0 && (
        <section id="amenities" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Amenities</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Everything you need</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.amenities.map((a) => (
              <div key={a} className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                <span className="text-[var(--foreground)]/90">{a}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOCATION */}
      <section id="location" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Location</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Where you&apos;ll be</h2>
          <p className="mt-3 text-[var(--muted)]">{property.location}</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
            <iframe
              title={`Map of ${property.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(property.mapQuery ?? property.location)}&z=13&output=embed`}
              className="h-[360px] w-full sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Approximate area shown. The exact address is provided after booking.
          </p>
        </div>
      </section>

      {/* AREA */}
      {property.area && (
        <section id="area" className="bg-[var(--sea)] text-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">The area</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Your coastal basecamp</h2>
            <p className="mt-5 max-w-2xl text-lg text-white/80">{property.area.intro}</p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {property.area.things.map((t) => (
                <div key={t.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                  <h3 className="font-display text-xl">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOOK */}
      <section id="book" className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Reserve your stay</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Check dates & book {property.name}</h2>
        <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">
          Booking and secure payment are handled directly through our reservation system. Select your dates below to see availability and request your stay.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
            <OwnerRezWidget widget={property.ownerRez} />
            <p className="mt-4 text-xs text-[var(--muted)]">Have a question first? Use the form above to send an inquiry.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS — this home's reviews (falls back to recent collection reviews) */}
      <Reviews
        heading={homeReviews.length ? `What guests say about ${property.name}` : "Loved by our guests"}
        average={average}
        count={count}
        reviews={homeReviews.length ? homeReviews : reviews.slice(0, 6)}
        note={homeReviews.length ? "Overall rating across all Step Away Lodging homes." : "Recent reviews from guests across our collection of coastal homes."}
      />

      <Footer subtitle={`${property.name} · ${property.location}`} />
    </div>
  );
}
