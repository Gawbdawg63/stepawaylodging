import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { brand, story } from "@/lib/content";

export const metadata: Metadata = {
  title: `Our Story — ${brand.name}`,
  description:
    "Step Away Lodging offers thoughtfully curated Oregon vacation rentals — coast and high desert — professionally managed and personally cared for by a local, family-owned team.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  return (
    <div>
      <Header />
      <PageHero eyebrow="Our story" title={story.tagline} />

      {/* Intro with photo */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.jpg" alt="The Oregon Coast at sunset" className="min-h-[320px] w-full rounded-3xl object-cover shadow-sm" />
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center font-display text-2xl leading-snug text-[var(--sea)] sm:text-3xl">
          {story.closing}
        </p>
      </section>

      {/* Family story */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Family owned & operated</p>
          <h2 className="mt-2 text-center font-display text-3xl text-[var(--sea)] sm:text-4xl">{story.family.heading}</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
            {story.family.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {story.values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-xl text-[var(--sea)]">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
            <h2 className="font-display text-2xl text-[var(--sea)]">Plan your stay</h2>
            <p className="mx-auto mt-2 max-w-sm text-[var(--muted)]">Browse our hand-picked homes and book direct with the people who care for them.</p>
            <Link href="/homes" className="mt-5 inline-block rounded-full bg-[var(--sand)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--sand-600)]">Browse our homes</Link>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
            <h2 className="font-display text-2xl text-[var(--sea)]">Own a home?</h2>
            <p className="mx-auto mt-2 max-w-sm text-[var(--muted)]">With 30 years in short-term rentals, our family-owned team manages your property end to end.</p>
            <Link href="/owners" className="mt-5 inline-block rounded-full border border-[var(--sea)] px-7 py-3.5 font-semibold text-[var(--sea)] transition hover:bg-[var(--sea)] hover:text-white">Partner with us</Link>
          </div>
        </div>
      </section>

      <Footer subtitle="Family owned & operated · Oregon Coast" />
    </div>
  );
}
