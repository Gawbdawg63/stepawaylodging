import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { brand, properties } from "@/lib/content";
import { siteJsonLd } from "@/lib/seo";
import { getReviews } from "@/lib/reviews";

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

const explore = [
  { href: "/homes", title: "Our Homes", text: "Browse all 7 coastal homes and suites, each with a hot tub." },
  { href: "/events", title: "Lincoln City Events", text: "Kite festivals, glass-float hunts, and more all year long." },
  { href: "/central-oregon", title: "Central Oregon", text: "We're expanding inland — and looking for homes to manage." },
  { href: "/blog", title: "The Journal", text: "Local guides and tips for the central Oregon coast." },
];

export default async function Home() {
  const featured = properties.slice(0, 3);
  const { average, count, reviews } = await getReviews();

  return (
    <div id="top">
      <JsonLd data={siteJsonLd(average, count)} />
      <Header />

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg'), url('/homes/ocean-peak-ridge.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(11,42,43,0.72) 0%, rgba(15,56,57,0.5) 45%, rgba(20,73,74,0.72) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-white/70">Vacation Homes · Oregon Coast</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">Step Away Lodging</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
            Hand-picked coastal homes and suites — each with a hot tub, all along Oregon&apos;s central coast. Book direct.
          </p>
          <div className="mt-10">
            <SearchBar />
          </div>
          <div className="mt-5">
            <Link href="/homes" className="text-sm font-semibold text-white/85 underline-offset-4 transition hover:text-white hover:underline">or browse all {properties.length} homes →</Link>
          </div>
        </div>
      </section>

      {/* FEATURED HOMES */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Featured stays</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">A few of our homes</h2>
          </div>
          <Link href="/homes" className="font-semibold text-[var(--sand-600)] transition hover:text-[var(--sea)]">View all {properties.length} homes →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.slug} href={`/homes/${p.slug}`} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/${p.card}`} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-[var(--sea)]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur">{p.location}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[var(--sea)]">{p.name}</h3>
                <div className="mt-1 text-sm text-[var(--muted)]">Sleeps {p.stats.sleeps} · {p.stats.bedrooms} bd · {num(p.stats.bathrooms)} ba</div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">{p.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <Reviews heading="Loved by our guests" average={average} count={count} reviews={reviews} />

      {/* EXPLORE */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <h2 className="mb-10 text-center font-display text-3xl text-[var(--sea)] sm:text-4xl">Explore Step Away Lodging</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {explore.map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-display text-xl text-[var(--sea)]">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{c.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[var(--sand-600)] transition group-hover:text-[var(--sea)]">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer subtitle={brand.tagline} />
    </div>
  );
}
