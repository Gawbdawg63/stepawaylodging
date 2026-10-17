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
import { collections, collectionHomes, type Collection } from "@/lib/collections";
import { areas } from "@/lib/areas";

export default async function CollectionPage({ collection }: { collection: Collection }) {
  const { average, count } = await getReviews();
  const homes = collectionHomes(collection);
  const otherCollections = collections.filter((c) => c.slug !== collection.slug);

  return (
    <div className="pb-20 md:pb-0">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: collection.heading, path: `/${collection.slug}` },
      ])} />
      <JsonLd data={faqJsonLd(collection.faqs)} />
      <Header />
      <PageHero eyebrow={collection.eyebrow} title={collection.heading} subtitle={collection.subtitle} />

      <TrustStrip average={average} count={count} />

      {/* Intro / SEO copy */}
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        <div className="space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {collection.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Homes */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">{collection.name} rentals</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">{collection.homesHeading}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="mb-10 text-center font-display text-3xl text-[var(--sea)] sm:text-4xl">{collection.pointsTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collection.points.map((pt) => (
            <div key={pt.title} className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--sea)]">{pt.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{pt.text}</p>
            </div>
          ))}
        </div>
      </section>

      <BookDirect />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Good to know</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Common questions</h2>
        </div>
        <dl className="divide-y divide-[var(--border)]">
          {collection.faqs.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-display text-lg text-[var(--sea)]">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-[var(--foreground)]/85">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cross-links */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-[var(--muted)]">Explore more:</span>
            {otherCollections.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--sea)] transition hover:border-[var(--sea)]">
                {c.name} rentals
              </Link>
            ))}
            {areas.map((a) => (
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
