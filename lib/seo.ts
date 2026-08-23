import { brand, type Property } from "@/lib/content";

const BASE = `https://${brand.domain}`;

export const abs = (path: string) => `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

// Best-effort locality for structured data (all homes sit around Lincoln City, OR).
function locality(location: string): string {
  if (/lincoln beach/i.test(location)) return "Lincoln Beach";
  if (/lincoln city/i.test(location)) return "Lincoln City";
  if (/depoe bay/i.test(location)) return "Depoe Bay";
  return "Lincoln City";
}

function geoFromMapQuery(mapQuery?: string): { latitude: number; longitude: number } | null {
  if (!mapQuery) return null;
  const m = mapQuery.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  return m ? { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) } : null;
}

export type ReviewsForSchema = {
  average?: number | null;
  count?: number | null;
  reviews?: { author: string; stars: number; body: string; date?: string }[];
};

// Structured data for a single home (schema.org VacationRental — Google's spec:
// geo, containsPlace, identifier, and 8+ images make it a valid rich result).
export function propertyJsonLd(p: Property, r?: ReviewsForSchema) {
  const geo = geoFromMapQuery(p.mapQuery);
  const images = p.photos.slice(0, 12).map((ph) => abs(`/${ph.file}`));
  const amenityFeature = (p.amenities ?? []).map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a,
    value: true,
  }));
  const occupancy = { "@type": "QuantitativeValue", value: p.stats.sleeps };
  const petsAllowed = (p.amenities ?? []).some((a) => /pet/i.test(a));

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    additionalType: "https://schema.org/House",
    identifier: { "@type": "PropertyValue", propertyID: "OwnerRez", value: p.ownerRez.propertyId ?? p.slug },
    name: p.name,
    description: [p.headline, ...(p.description ?? [])].join(" ").slice(0, 600),
    url: abs(`/homes/${p.slug}`),
    image: images,
    brand: { "@type": "Brand", name: brand.name },
    ...(geo ? { latitude: geo.latitude, longitude: geo.longitude, geo: { "@type": "GeoCoordinates", ...geo } } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: locality(p.location),
      addressRegion: "OR",
      addressCountry: "US",
    },
    checkinTime: "16:00:00",
    checkoutTime: "11:00:00",
    numberOfBedrooms: p.stats.bedrooms,
    numberOfBathroomsTotal: p.stats.bathrooms,
    petsAllowed,
    knowsLanguage: "en-US",
    amenityFeature,
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "EntirePlace",
      name: p.name,
      numberOfBedrooms: p.stats.bedrooms,
      numberOfBathroomsTotal: p.stats.bathrooms,
      occupancy,
      amenityFeature,
    },
    ...(r?.average && r?.count
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: r.average, reviewCount: r.count, bestRating: 5, worstRating: 1 } }
      : {}),
    ...(r?.reviews?.length
      ? {
          review: r.reviews.slice(0, 5).map((rv) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: rv.stars, bestRating: 5, worstRating: 1 },
            author: { "@type": "Person", name: rv.author || "Guest" },
            ...(rv.date ? { datePublished: rv.date } : {}),
            reviewBody: rv.body,
          })),
        }
      : {}),
  };
}

// Structured data for the whole brand (schema.org LodgingBusiness).
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
  };
}
