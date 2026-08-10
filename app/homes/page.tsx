import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import HomesGrid from "@/components/HomesGrid";
import OwnerRezWidget from "@/components/OwnerRezWidget";
import { brand, searchWidget } from "@/lib/content";

export const metadata: Metadata = {
  title: `Our Homes — ${brand.name}`,
  description: "Browse all Step Away Lodging vacation homes and suites on the Oregon Coast. Search availability and book direct.",
  alternates: { canonical: "/homes" },
};

export default function HomesPage() {
  return (
    <div>
      <Header />
      <PageHero
        eyebrow="Vacation homes · Oregon Coast"
        title="Our Homes"
        subtitle="Hand-picked coastal homes and suites — each with a hot tub. Search your dates to see what's open."
      />

      {/* Availability search */}
      <section id="search" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:py-14">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
            <OwnerRezWidget widget={searchWidget} />
          </div>
        </div>
      </section>

      <HomesGrid />
      <Footer subtitle={brand.tagline} />
    </div>
  );
}
