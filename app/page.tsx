import Header from "@/components/Header";
import HomesGrid from "@/components/HomesGrid";
import OwnerRezWidget from "@/components/OwnerRezWidget";
import OwnerCTA from "@/components/OwnerCTA";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { brand, searchWidget } from "@/lib/content";
import { siteJsonLd } from "@/lib/seo";

const navLinks = [
  { href: "#homes", label: "Our Homes" },
  { href: "#search", label: "Check Dates" },
  { href: "#owners", label: "For Owners" },
];

export default function Home() {
  return (
    <div id="top">
      <JsonLd data={siteJsonLd()} />
      <Header links={navLinks} cta={{ href: "#search", label: "Check availability" }} />

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/homes/ocean-peak-ridge.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(11,42,43,0.78) 0%, rgba(15,56,57,0.6) 45%, rgba(20,73,74,0.78) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-white/70">Vacation Homes · Oregon Coast</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">Step Away Lodging</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
            A collection of hand-picked coastal homes and suites — each with a hot tub, all along
            Oregon's central coast. Find yours and book direct.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#homes" className="rounded-full bg-[var(--sand)] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[var(--sand-600)]">Browse our homes</a>
            <a href="#search" className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10">Check availability</a>
          </div>
        </div>
      </section>

      {/* PORTFOLIO AVAILABILITY SEARCH */}
      <section id="search" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Check availability</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Search all our homes at once</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Enter your dates and group size to see every Step Away Lodging home that&apos;s open — then book direct.
          </p>
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
            <OwnerRezWidget widget={searchWidget} />
          </div>
        </div>
      </section>

      {/* HOMES GRID */}
      <HomesGrid />

      {/* OWNERS */}
      <OwnerCTA />

      <Footer subtitle={brand.tagline} />
    </div>
  );
}
