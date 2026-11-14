import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { brand, specials } from "@/lib/content";

export const metadata: Metadata = {
  title: `Specials — ${brand.name}`,
  description:
    "Seasonal specials on Step Away Lodging's Oregon Coast vacation rentals — last-minute, spring, fall, winter and midweek deals — plus personalized gift certificates.",
  alternates: { canonical: "/specials" },
};

const telHref = `tel:${brand.phone.replace(/\D/g, "")}`;

export default function SpecialsPage() {
  return (
    <div>
      <Header />
      <PageHero eyebrow="Specials" title="Seasonal specials" subtitle={specials.intro} />

      {/* Specials grid */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {specials.items.map((s) => (
            <div
              key={s.season}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:shadow-md sm:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">{s.season}</p>
              <p className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">{s.headline}</p>
              <p className="mt-4 text-lg leading-relaxed text-[var(--foreground)]/85">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Call to book */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-[var(--sea)] px-6 py-10 text-center text-white sm:py-12">
          <p className="font-display text-2xl sm:text-3xl">Call to lock in your special</p>
          <p className="max-w-xl text-white/85">
            Specials are applied by hand, so give us a quick call before you book and we’ll take care of the rest.
          </p>
          <a
            href={telHref}
            className="mt-2 rounded-full bg-[var(--sand)] px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]"
          >
            Call {brand.phone}
          </a>
        </div>
      </section>

      {/* Gift certificates */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">The perfect gift</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">{specials.gift.heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--foreground)]/85">{specials.gift.body}</p>
          <a
            href={telHref}
            className="mt-8 inline-block rounded-full bg-[var(--sea)] px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--sea-700)]"
          >
            Call {brand.phone} for a gift certificate
          </a>
          <p className="mt-4 text-sm text-[var(--foreground)]/60">
            or email{" "}
            <a href={`mailto:${brand.email}`} className="underline underline-offset-2 hover:text-[var(--sea)]">
              {brand.email}
            </a>
          </p>
        </div>
      </section>

      {/* Fine print */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">The fine print</p>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--foreground)]/70">
          {specials.finePrint.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
