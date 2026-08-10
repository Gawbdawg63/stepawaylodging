import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { policyGroups } from "@/lib/policies";
import { brand } from "@/lib/content";

// FAQPage structured data → eligible for expandable Q&A rich results in Google.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: policyGroups.flatMap((g) =>
    g.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export const metadata: Metadata = {
  title: `Policies & FAQ — ${brand.name}`,
  description: "Check-in, reservations, cancellation, pets, taxes, and house rules for Step Away Lodging vacation homes on the Oregon Coast.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <div>
      <JsonLd data={faqJsonLd} />
      <Header />
      <PageHero eyebrow="Good to know" title="Policies & FAQ" subtitle="Everything you need to know before your stay — booking, check-in, house rules, and more." />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        {policyGroups.map((group) => (
          <div key={group.title} className="mb-12">
            <h2 className="mb-4 font-display text-2xl text-[var(--sea)]">{group.title}</h2>
            <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
              {group.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-[var(--foreground)] transition hover:bg-[var(--background)]">
                    <span>{item.q}</span>
                    <span className="shrink-0 text-[var(--sand-600)] transition group-open:rotate-45">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-0 leading-relaxed text-[var(--muted)]">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-[var(--border)] bg-white p-7 text-center shadow-sm">
          <h2 className="font-display text-2xl text-[var(--sea)]">Still have a question?</h2>
          <p className="mt-2 text-[var(--muted)]">We&apos;re here 7 days a week, with 24/7 help during your stay.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold text-[var(--sea)]">
            {brand.phone && <a href={`tel:${brand.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[var(--sand-600)]">{brand.phone}</a>}
            {brand.email && <a href={`mailto:${brand.email}`} className="hover:text-[var(--sand-600)]">{brand.email}</a>}
          </div>
        </div>
      </section>

      <Footer subtitle="Policies & guest information" />
    </div>
  );
}
