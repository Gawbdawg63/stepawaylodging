import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import TrustStrip from "@/components/TrustStrip";
import PropertyCard from "@/components/PropertyCard";
import BookDirect from "@/components/BookDirect";
import MobileCTA from "@/components/MobileCTA";
import JsonLd from "@/components/JsonLd";
import { brand } from "@/lib/content";
import { getReviews } from "@/lib/reviews";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { areas, areaHomes, type Area } from "@/lib/areas";

export default async function AreaPage({ area }: { area: Area }) {
  const { average, count } = await getReviews();
  const homes = areaHomes(area);
  const others = areas.filter((a) => a.slug !== area.slug);

  return (
    <div className="pb-20 md:pb-0">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: area.heading, path: `/${area.slug}` },
      ])} />
      <JsonLd data={faqJsonLd(area.faqs)} />
      <Header />
      <PageHero eyebrow={area.eyebrow} title={area.heading} subtitle={area.subtitle} />

      <TrustStrip average={average} count={count} />

      {/* Intro / SEO copy */}
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        <div className="space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {area.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Homes in this area */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Our homes in {area.name}</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">
              {homes.length} {area.name} {homes.length === 1 ? "rental" : "rentals"}, each with a hot tub
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Local info */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="mb-10 text-center font-display text-3xl text-[var(--sea)] sm:text-4xl">{area.localTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {area.local.map((l) => (
            <div key={l.title} className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--sea)]">{l.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{l.text}</p>
            </div>
          ))}
        </div>
      </section>

      <BookDirect />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Good to know</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">{area.name} rentals: common questions</h2>
        </div>
        <dl className="divide-y divide-[var(--border)]">
          {area.faqs.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-display text-lg text-[var(--sea)]">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-[var(--foreground)]/85">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cross-links to other areas + all homes */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-[var(--muted)]">Explore more:</span>
            {others.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--sea)] transition hover:border-[var(--sea)]">
                {a.name} rentals
              </Link>
            ))}
            <Link href="/homes" className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--sea)] transition hover:border-[var(--sea)]">
              All {brand.name} homes
            </Link>
          </div>
        </div>
      </section>

      <Footer subtitle={brand.tagline} />
      <MobileCTA />
    </div>
  );
}
