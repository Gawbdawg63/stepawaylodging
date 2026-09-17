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

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

// Normalize a scraped review date to an ISO 8601 date (YYYY-MM-DD) for schema.
// Handles "Aug 2026", "August 2026", "2026-08-05", and "8/5/2026". Returns null
// when it can't be parsed, so we omit datePublished rather than emit bad data.
function reviewDateISO(s?: string): string | null {
  if (!s) return null;
  const t = s.trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/); // already ISO
  if (m) return t;
  m = t.match(/^([A-Za-z]{3,})\.?\s+(\d{4})$/); // "Aug 2026" / "August 2026"
  if (m) {
    const mo = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mo) return `${m[2]}-${mo}-01`;
  }
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // "8/5/2026"
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return null;
}

// Structured data for a single home. We use LodgingBusiness (a LocalBusiness),
// NOT VacationRental: Google's VacationRental rich result is a partner program
// that requires the home's exact street address, postal code, and bed-level
// detail — which we deliberately keep off the site for guest privacy. This type
// validates cleanly with locality-level address and still carries geo, amenities,
// and ratings for search and AI answer engines.
export function propertyJsonLd(p: Property, r?: ReviewsForSchema) {
  const geo = geoFromMapQuery(p.mapQuery);
  const images = p.photos.slice(0, 12).map((ph) => abs(`/${ph.file}`));
  const amenityFeature = (p.amenities ?? []).map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a,
    value: true,
  }));
  const petsAllowed = (p.amenities ?? []).some((a) => /pet/i.test(a));

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${abs(`/homes/${p.slug}`)}#lodging`,
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
    ...(brand.phone ? { telephone: brand.phone } : {}),
    priceRange: "$$",
    numberOfRooms: p.stats.bedrooms,
    petsAllowed,
    checkinTime: "16:00:00",
    checkoutTime: "11:00:00",
    amenityFeature,
    ...(r?.average && r?.count
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: r.average, reviewCount: r.count, bestRating: 5, worstRating: 1 } }
      : {}),
    ...(r?.reviews?.length
      ? {
          review: r.reviews.slice(0, 5).map((rv) => {
            const iso = reviewDateISO(rv.date);
            return {
              "@type": "Review",
              reviewRating: { "@type": "Rating", ratingValue: rv.stars, bestRating: 5, worstRating: 1 },
              author: { "@type": "Person", name: rv.author || "Guest" },
              ...(iso ? { datePublished: iso } : {}),
              reviewBody: rv.body,
            };
          }),
        }
      : {}),
  };
}

// Structured data for the whole brand (schema.org LodgingBusiness).
// Rich entity data helps both Google and AI answer engines (AEO) understand
// exactly who the business is, where it operates, and what it offers.
export function siteJsonLd(average?: number | null, count?: number | null) {
  return {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "PropertyManagementCompany"],
    "@id": `${BASE}#business`,
    name: brand.name,
    legalName: brand.name,
    slogan: brand.tagline,
    ...(average && count
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: average, reviewCount: count, bestRating: 5, worstRating: 1 } }
      : {}),
    description:
      "Step Away Lodging is a family-owned vacation-rental and property-management company on Oregon's central coast. We offer a curated collection of coastal homes and suites — each with a private hot tub — bookable direct, and provide full-service property management for owners on the Oregon Coast and in Central Oregon.",
    url: BASE,
    image: abs("/homes/ocean-peak-ridge.jpg"),
    logo: abs("/apple-icon.png"),
    priceRange: "$$",
    numberOfRooms: 7,
    founder: { "@type": "Person", name: "Lisa Ward", description: "Founder with 30+ years in Oregon Coast vacation rentals." },
    knowsAbout: [
      "Oregon Coast vacation rentals",
      "Lincoln City vacation homes",
      "vacation rental property management",
      "pet-friendly beach rentals",
      "vacation homes with hot tubs",
      "Depoe Bay",
      "Central Oregon vacation rentals",
    ],
    areaServed: [
      { "@type": "City", name: "Lincoln City", address: { "@type": "PostalAddress", addressRegion: "OR", addressCountry: "US" } },
      { "@type": "City", name: "Depoe Bay", address: { "@type": "PostalAddress", addressRegion: "OR", addressCountry: "US" } },
      { "@type": "Place", name: "Oregon Coast" },
      { "@type": "Place", name: "Central Oregon" },
    ],
    address: { "@type": "PostalAddress", addressRegion: "OR", addressCountry: "US" },
    ...(brand.phone ? { telephone: brand.phone } : {}),
    ...(brand.email ? { email: brand.email } : {}),
    sameAs: [brand.social.facebook, brand.social.instagram, brand.social.pinterest].filter(Boolean),
  };
}

// FAQPage structured data — answer-first Q&A that AI answer engines (ChatGPT,
// Perplexity, Google AI Overviews) can lift directly. Pair with a visible FAQ.
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// BreadcrumbList structured data — clarifies page hierarchy for search and AI.
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
