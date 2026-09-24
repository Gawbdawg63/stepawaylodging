import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import OwnerCTA from "@/components/OwnerCTA";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `Partner With Us — ${brand.name}`,
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

      {/* Welcome portal entry — for owners coming aboard */}
      <section className="bg-[var(--sea)] text-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">Ready to get started?</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Already coming aboard?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Use our welcome portal to send us your home&apos;s details — you&apos;ll essentially be creating your listing,
            and we&apos;ll take it from there. It saves as you go, so there&apos;s no rush to finish in one sitting.
          </p>
          <Link href="/list-your-home" className="mt-7 inline-block rounded-full bg-[var(--sand)] px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]">
            List your home →
          </Link>
        </div>
      </section>

      <Footer subtitle="Property management on the Oregon Coast" />
    </div>
  );
}
