import { brand, properties, type Property } from "@/lib/content";

const BASE = `https://${brand.domain}`;

export const abs = (path: string) => `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

// Best-effort locality for structured data (all homes sit around Lincoln City, OR).
function locality(location: string): string {
  if (/lincoln beach/i.test(location)) return "Lincoln Beach";
  if (/lincoln city/i.test(location)) return "Lincoln City";
  if (/depoe bay/i.test(location)) return "Depoe Bay";
  return "Lincoln City";
}

// Structured data for a single home (schema.org VacationRental).
export function propertyJsonLd(p: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: p.name,
    description: p.headline,
    url: abs(`/homes/${p.slug}`),
    image: p.photos.slice(0, 6).map((ph) => abs(`/${ph.file}`)),
    brand: { "@type": "Brand", name: brand.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: locality(p.location),
      addressRegion: "OR",
      addressCountry: "US",
    },
    numberOfBedrooms: p.stats.bedrooms,
    numberOfBathroomsTotal: p.stats.bathrooms,
    occupancy: { "@type": "QuantitativeValue", maxValue: p.stats.sleeps },
    amenityFeature: (p.amenities ?? []).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    containedInPlace: { "@type": "Place", name: "Oregon Coast" },
  };
}

// Structured data for the whole brand (schema.org LodgingBusiness + home list).
export function siteJsonLd(average?: number | null, count?: number | null) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: brand.name,
    ...(average && count
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: average, reviewCount: count, bestRating: 5 } }
      : {}),
    description:
      "Hand-picked vacation homes and suites on the Oregon Coast, each with a hot tub. Book direct with Step Away Lodging.",
    url: BASE,
    image: abs("/homes/ocean-peak-ridge.jpg"),
    areaServed: { "@type": "Place", name: "Oregon Coast" },
    address: { "@type": "PostalAddress", addressRegion: "OR", addressCountry: "US" },
    ...(brand.phone ? { telephone: brand.phone } : {}),
    ...(brand.email ? { email: brand.email } : {}),
    sameAs: [brand.social.facebook, brand.social.instagram, brand.social.pinterest].filter(Boolean),
    makesOffer: properties.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "VacationRental",
        name: p.name,
        url: abs(`/homes/${p.slug}`),
      },
    })),
  };
}
