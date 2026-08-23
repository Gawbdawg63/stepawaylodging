import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyPage from "@/components/PropertyPage";
import JsonLd from "@/components/JsonLd";
import { properties, getProperty, brand } from "@/lib/content";
import { propertyJsonLd } from "@/lib/seo";
import { getReviews, reviewMatchesHome } from "@/lib/reviews";

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: brand.name };
  const specs = `Sleeps ${property.stats.sleeps} · ${property.stats.bedrooms} bd · ${num(property.stats.bathrooms)} ba`;
  const description = `${property.headline} ${specs}. In ${property.location}. Book direct with ${brand.name}.`;
  return {
    title: `${property.name} — ${property.location} | ${brand.name}`,
    description,
    alternates: { canonical: `/homes/${property.slug}` },
    openGraph: {
      title: `${property.name} — ${brand.name}`,
      description,
      url: `/homes/${property.slug}`,
      type: "website",
      images: [{ url: `/${property.card}`, alt: property.name }],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const { average, count, reviews } = await getReviews();
  const homeReviews = reviews.filter((rv) => reviewMatchesHome(rv.property, property.name));
  const schemaReviews = (homeReviews.length ? homeReviews : reviews).slice(0, 5);

  return (
    <>
      <JsonLd data={propertyJsonLd(property, { average, count, reviews: schemaReviews })} />
      <PropertyPage property={property} />
    </>
  );
}
