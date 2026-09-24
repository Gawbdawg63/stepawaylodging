import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ListingIntakeForm from "@/components/ListingIntakeForm";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `List Your Home — ${brand.name}`,
  description:
    "Welcome to Step Away Lodging! Tell us about your Oregon Coast home and we'll build your vacation-rental listing and take it from there. Family-owned, full-service management.",
  alternates: { canonical: "/list-your-home" },
};

export default function ListYourHomePage() {
  return (
    <div>
      <Header cta={{ href: "/owners", label: "For owners" }} />
      <PageHero eyebrow="Welcome to the family" title="Let's list your home" />

      <section className="mx-auto max-w-3xl px-5 pt-12 text-center">
        <p className="text-lg leading-relaxed text-[var(--foreground)]/85">
          We&apos;re so glad you&apos;re here. Tell us about your home below — it gives our team everything we need to get
          your place set up and managed beautifully.
        </p>
        <p className="mt-4 text-[var(--muted)]">
          It doesn&apos;t have to be perfect, and you don&apos;t have to finish in one sitting — your progress saves as you
          go. Only a few fields are required; send us the rest as you have it. Photos are optional.
        </p>
      </section>

      <ListingIntakeForm />

      <Footer subtitle="Family owned & operated · Oregon Coast" />
    </div>
  );
}
