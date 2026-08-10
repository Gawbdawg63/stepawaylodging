import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { postsByDate } from "@/lib/blog";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `Blog — ${brand.name}`,
  description: "Coastal travel tips, local guides, and news from Step Away Lodging on the Oregon Coast.",
  alternates: { canonical: "/blog" },
};

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPage() {
  return (
    <div>
      <Header />
      <PageHero eyebrow="From the coast" title="The Step Away Journal" subtitle="Local guides, travel tips, and news from the Oregon Coast." />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {postsByDate.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/${p.cover}`} alt={p.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full" style={{ background: "linear-gradient(140deg, var(--sea) 0%, var(--sea-700) 100%)" }} />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="text-sm text-[var(--muted)]">{fmt(p.date)}</div>
                <h2 className="mt-1 font-display text-xl text-[var(--sea)]">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--foreground)]/80">{p.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-[var(--sand-600)] transition group-hover:text-[var(--sea)]">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer subtitle="From the Oregon Coast" />
    </div>
  );
}
