import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import OwnerCTA from "@/components/OwnerCTA";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `List Your Home — ${brand.name}`,
  description:
    "Own a vacation home on the Oregon Coast or in Central Oregon? Step Away Lodging handles listings, bookings, guest care, and cleaning. Apply to have us manage your home.",
  alternates: { canonical: "/owners" },
};

export default function OwnersPage() {
  return (
    <div>
      <Header />
      <PageHero
        eyebrow="For homeowners"
        title="Partner with Step Away Lodging"
        subtitle="We manage your vacation rental end to end — so your home earns more while you do less."
      />
      <OwnerCTA />
      <Footer subtitle="Property management on the Oregon Coast" />
    </div>
  );
}
