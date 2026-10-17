import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { posts, getPost } from "@/lib/blog";
import { brand, getProperty, type Property } from "@/lib/content";
import { abs, breadcrumbJsonLd } from "@/lib/seo";
import PropertyCard from "@/components/PropertyCard";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: brand.name };
  const metaTitle = p.seoTitle ? `${p.seoTitle} | ${brand.name}` : `${p.title} — ${brand.name}`;
  const metaDescription = p.seoDescription ?? p.excerpt;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: metaTitle, description: metaDescription, url: `/blog/${p.slug}`, type: "article", ...(p.cover ? { images: [`/${p.cover}`] } : {}) },
  };
}

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const related = (p.relatedHomes ?? [])
    .map((s) => getProperty(s))
    .filter((h): h is Property => Boolean(h));

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
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: p.title, path: `/blog/${p.slug}` },
      ])} />
      <Header />
      <PageHero eyebrow={fmt(p.date)} title={p.title} />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <Link href="/blog" className="text-sm text-[var(--sand-600)] transition hover:text-[var(--sea)]">← All posts</Link>
        {p.cover && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={`/${p.cover}`} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
        )}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--foreground)]/90">
          {p.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-[var(--sea)]">Homes featured in this guide</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((home) => <PropertyCard key={home.slug} p={home} />)}
            </div>
          </div>
        )}

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
