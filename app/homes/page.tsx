import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import HomesGrid from "@/components/HomesGrid";
import SearchBar from "@/components/SearchBar";
import TrustStrip from "@/components/TrustStrip";
import HomesMap from "@/components/HomesMap";
import MobileCTA from "@/components/MobileCTA";
import { brand } from "@/lib/content";
import { getReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Oregon Coast Vacation Rentals with Hot Tubs | Step Away Lodging",
  description:
    "Browse all 7 Step Away Lodging vacation homes and suites near Lincoln City on the Oregon Coast — each with a private hot tub. Check live availability and book direct.",
  alternates: { canonical: "/homes" },
};

export default async function HomesPage() {
  const { average, count } = await getReviews();
  return (
    <div className="pb-20 md:pb-0">
      <Header />
      <PageHero
        eyebrow="Vacation homes · Oregon Coast"
        title="Our Homes"
        subtitle="Hand-picked coastal homes and suites — each with a hot tub. Search your dates to see what's open."
      />

      <TrustStrip average={average} count={count} />

      {/* Availability search */}
      <section id="search" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:py-12">
          <SearchBar />
        </div>
      </section>

      <HomesGrid />
      <HomesMap />
      <Footer subtitle={brand.tagline} />
      <MobileCTA />
    </div>
  );
}
