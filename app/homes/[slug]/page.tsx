import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyPage from "@/components/PropertyPage";
import JsonLd from "@/components/JsonLd";
import { properties, getProperty, brand } from "@/lib/content";
import { propertyJsonLd } from "@/lib/seo";

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
  return (
    <>
      <JsonLd data={propertyJsonLd(property)} />
      <PropertyPage property={property} />
    </>
  );
}
