import { brand, properties } from "@/lib/content";

// /llms.txt — a concise, structured brief for AI answer engines (AEO).
// Generated from site content so it stays in sync as homes are added or changed.
// Convention: https://llmstxt.org
export const dynamic = "force-static";

export function GET() {
  const base = `https://${brand.domain}`;
  const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

  const homeLines = properties
    .map(
      (p) =>
        `- [${p.name}](${base}/homes/${p.slug}): ${p.location}. Sleeps ${p.stats.sleeps}, ${p.stats.bedrooms} bed / ${num(
          p.stats.bathrooms
        )} bath. ${p.blurb}`
    )
    .join("\n");

  const body = `# ${brand.name}

> ${brand.name} is a family-owned vacation-rental and property-management company on Oregon's central coast (Lincoln City area), expanding into Central Oregon. We offer a curated collection of coastal homes and suites — every one with a private hot tub — bookable directly, and provide full-service property management for owners.

Key facts:
- Family owned and operated, led by Lisa Ward, with 30+ years of experience in Oregon Coast vacation rentals.
- ${properties.length} hand-picked homes and suites, sleeping from 2 to 10 guests. Every home has a private hot tub.
- Located primarily in Lincoln City, Oregon (Olivia Beach and Roads End neighborhoods) and nearby Lincoln Beach and Depoe Bay.
- Book direct at ${base} — typically better rates than Airbnb/Vrbo with no extra platform service fees.
- Several homes are pet-friendly (one dog, 50 lb limit, leashed, not left unattended).
- Bookings and availability are powered by OwnerRez.
- Contact: phone/text ${brand.phone}, email ${brand.email}.
- Also provides full-service property management for vacation-home owners on the Oregon Coast and in Central Oregon.

## Homes
${homeLines}

## Key pages
- [Our Homes](${base}/homes): the full collection of vacation rentals.
- [Search availability](${base}/search): check dates and pricing across all homes.
- [Our Story](${base}/our-story): the family behind Step Away Lodging.
- [For Owners](${base}/owners): full-service property management for vacation-home owners.
- [Central Oregon](${base}/central-oregon): our expansion into the high desert.
- [Lincoln City Events](${base}/events): local events throughout the year.
- [Blog](${base}/blog): local guides and travel tips for the central Oregon coast.
- [Policies & FAQ](${base}/policies): booking, check-in, pets, and cancellation policies.

## Booking
Guests book directly on each home's page at ${base}/homes. To reach the team, call or text ${brand.phone} or email ${brand.email}.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
