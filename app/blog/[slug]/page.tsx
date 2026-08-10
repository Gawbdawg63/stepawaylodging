import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { posts, getPost } from "@/lib/blog";
import { brand } from "@/lib/content";
import { abs } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: brand.name };
  return {
    title: `${p.title} — ${brand.name}`,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, url: `/blog/${p.slug}`, type: "article", ...(p.cover ? { images: [`/${p.cover}`] } : {}) },
  };
}

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    author: { "@type": "Organization", name: p.author },
    ...(p.cover ? { image: abs(`/${p.cover}`) } : {}),
    url: abs(`/blog/${p.slug}`),
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      <Header />
      <PageHero eyebrow={fmt(p.date)} title={p.title} />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <Link href="/blog" className="text-sm text-[var(--sand-600)] transition hover:text-[var(--sea)]">← All posts</Link>
        {p.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/${p.cover}`} alt={p.title} className="mt-6 max-h-[60vh] w-full rounded-2xl object-cover" />
        )}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {p.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-7 text-center shadow-sm">
          <h2 className="font-display text-2xl text-[var(--sea)]">Plan your coastal escape</h2>
          <Link href="/homes" className="mt-4 inline-block rounded-full bg-[var(--sand)] px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]">
            Browse our homes
          </Link>
        </div>
      </article>

      <Footer subtitle="From the Oregon Coast" />
    </div>
  );
}
