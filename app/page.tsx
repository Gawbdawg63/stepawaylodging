import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import OwnerRezWidget from "@/components/OwnerRezWidget";
import OwnerCTA from "@/components/OwnerCTA";
import { brand, primary as property } from "@/lib/content";

// --- small inline icons for highlights ---
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

export default function Home() {
  const { stats } = property;

  return (
    <div id="top">
      <Header />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        {/* Background: swap for a real hero photo by adding one to /public/photos */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #0b2a2b 0%, var(--sea-700) 40%, var(--sea) 100%)" }}
        />
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(90% 60% at 70% 10%, #ffffff 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-white/70">
            {property.location}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            {property.name}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
            {property.headline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span>Sleeps {stats.sleeps}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{stats.bedrooms} bedrooms</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{stats.bathrooms} baths</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#book"
              className="rounded-full bg-[var(--sand)] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[var(--sand-600)]"
            >
              Check availability
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              See the home
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- INTRO ---------------- */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Welcome to {property.name}</p>
        <div className="mt-5 space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {property.description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ---------------- HIGHLIGHTS ---------------- */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {property.highlights.map((h) => (
            <div key={h.title} className="text-center sm:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sea-100)] text-[var(--sea)] sm:mx-0">
                <Icon name={h.icon} />
              </div>
              <h3 className="font-display text-xl text-[var(--sea)]">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <Gallery />

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-24 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">The home</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Room to slow down</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-[var(--foreground)]/90">
              {property.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-8 flex gap-8">
              <div>
                <div className="font-display text-3xl text-[var(--sea)]">{stats.sleeps}</div>
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Guests</div>
              </div>
              <div>
                <div className="font-display text-3xl text-[var(--sea)]">{stats.bedrooms}</div>
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Bedrooms</div>
              </div>
              <div>
                <div className="font-display text-3xl text-[var(--sea)]">{stats.bathrooms}</div>
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Baths</div>
              </div>
            </div>
          </div>
          <div
            className="min-h-[320px] rounded-3xl border border-[var(--border)]"
            style={{ background: "linear-gradient(140deg, var(--sea) 0%, var(--sea-700) 60%, #0b2a2b 100%)" }}
          />
        </div>
      </section>

      {/* ---------------- AMENITIES ---------------- */}
      <section id="amenities" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Amenities</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Everything you need</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {property.amenities.map((a) => (
            <div key={a} className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-[var(--foreground)]/90">{a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- AREA ---------------- */}
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

      {/* ---------------- BOOK ---------------- */}
      <section id="book" className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Reserve your stay</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Check dates & book {property.name}</h2>
        <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">
          Booking and secure payment are handled directly through our reservation
          system. Select your dates below to see availability and request your stay.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
            <OwnerRezWidget />
            <p className="mt-4 text-xs text-[var(--muted)]">
              Have a question first? Use the form above to send an inquiry.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- OWNERS / PROPERTY MANAGEMENT ---------------- */}
      <OwnerCTA />

      {/* ---------------- FOOTER ---------------- */}
      <footer className="mt-auto bg-[var(--sea-700)] text-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <div>
            <div className="font-display text-lg text-white">{brand.name}</div>
            <div className="text-sm text-white/60">{property.name} · {property.location}</div>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm sm:items-end">
            {brand.phone && <a href={`tel:${brand.phone}`} className="hover:text-white">{brand.phone}</a>}
            {brand.email && <a href={`mailto:${brand.email}`} className="hover:text-white">{brand.email}</a>}
            <a href="#book" className="text-[var(--sand)] hover:text-white">Check availability →</a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-4 text-center text-xs text-white/50">
            © {property.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
