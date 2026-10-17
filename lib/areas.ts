// =============================================================================
// Area / neighborhood landing pages. Each entry renders an SEO page at /<slug>
// that targets local search ("Lincoln City vacation rentals", "Lincoln Beach
// cottages", etc.) and features the homes we actually have in that area.
// =============================================================================

import { properties, type Property } from "@/lib/content";

export type Area = {
  slug: string; // URL path, e.g. "lincoln-city-vacation-rentals"
  name: string; // "Lincoln City"
  title: string; // SEO <title>
  description: string; // meta description
  eyebrow: string;
  heading: string; // H1
  subtitle: string;
  intro: string[]; // SEO body paragraphs
  homeSlugs: string[]; // featured homes, in display order
  localTitle: string;
  local: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const areas: Area[] = [
  {
    slug: "lincoln-city-vacation-rentals",
    name: "Lincoln City",
    title: "Lincoln City Vacation Rentals with Hot Tubs | Step Away Lodging",
    description:
      "Book direct on a Lincoln City, Oregon vacation rental. Hand-picked homes in Olivia Beach and on Siletz Bay — each with a private hot tub, ocean or bay views, and no extra platform fees.",
    eyebrow: "Vacation rentals · Lincoln City, Oregon",
    heading: "Lincoln City Vacation Rentals",
    subtitle:
      "Hand-picked homes in Lincoln City, Oregon — from Olivia Beach to Siletz Bay — each with a private hot tub. Book direct with a local family.",
    intro: [
      "Lincoln City stretches seven miles along the central Oregon coast, from the Roads End headland in the north to Siletz Bay in the south — a whole string of sandy beaches, glass-float finds, and classic coastal towns rolled into one. Our Lincoln City vacation rentals put you right in the middle of it, each with a private hot tub and the hands-on local care you only get when you book direct.",
      "In the quiet Olivia Beach community on the south side of town, Ocean Peak Ridge offers three floors of ocean views and room for ten. On the water at Siletz Bay, Ebb and Flow is an oceanfront cottage with kayaks, crab traps, and bay views from the deck. Whether you're after a family beach house or a romantic coastal getaway, you'll be minutes from the outlet shops, Devil's Lake, Chinook Winds, and the famous Finders Keepers glass floats.",
      "Booking direct with Step Away Lodging means better rates with no added service fees, a signed rental agreement so everything's clear up front, and a local family to call if you need anything during your stay.",
    ],
    homeSlugs: ["ocean-peak-ridge", "ebb-and-flow"],
    localTitle: "Around Lincoln City",
    local: [
      { title: "Olivia Beach & Roads End", text: "Quiet sandy neighborhoods at the south and north ends of town — great for tide pools, kite-flying, and long sunset walks." },
      { title: "Siletz Bay", text: "Calm water for kayaking, crabbing, and clamming, with harbor seals hauled out on the sandbar and beach fires at dusk." },
      { title: "Glass float hunts", text: "Hand-blown glass floats are hidden along all seven miles of beach year-round — find one above the tide line and it's yours." },
      { title: "In town", text: "Chinook Winds Casino Resort, the Lincoln City Outlets, Devil's Lake, and a surprisingly good food and coffee scene are all minutes away." },
    ],
    faqs: [
      { q: "Where are your Lincoln City vacation rentals located?", a: "In Lincoln City, Oregon — Ocean Peak Ridge is in the Olivia Beach community on the south side of town, and Ebb and Flow sits right on Siletz Bay. Both are minutes from the beach, the outlets, and Chinook Winds." },
      { q: "Do the Lincoln City rentals have hot tubs?", a: "Yes. Every Step Away Lodging home, including our Lincoln City rentals, comes with a private hot tub." },
      { q: "Can I book a Lincoln City rental directly instead of through Airbnb or Vrbo?", a: "Yes — book directly at stepawaylodging.com for better rates, no extra platform service fees, and a local family to help you plan your stay." },
    ],
  },
  {
    slug: "lincoln-beach-vacation-rentals",
    name: "Lincoln Beach",
    title: "Lincoln Beach Vacation Rentals & Cottages | Step Away Lodging",
    description:
      "Lincoln Beach, Oregon cottages and homes — book direct. Cozy coastal rentals near Gleneden Beach and Depoe Bay, each with a private hot tub and steps to the sand.",
    eyebrow: "Vacation rentals · Lincoln Beach, Oregon",
    heading: "Lincoln Beach Vacation Rentals",
    subtitle:
      "Cozy cottages and family homes in Lincoln Beach, Oregon — between Lincoln City and Depoe Bay — each with a private hot tub.",
    intro: [
      "Lincoln Beach sits on a quiet stretch of the central Oregon coast between Lincoln City and Depoe Bay, where long sandy beaches meet tide-pool rocks and the pace slows right down. Our Lincoln Beach cottages and homes range from romantic suites for two to a four-story family beach house — every one with a private hot tub and an easy walk to the sand.",
      "The classic Americana beach home sleeps ten and comes with four beach cruisers, while its Paris Suite is a cozy retreat for two. Nearby, Barefoot Bungalow and its Carriage House sit a short stroll from the beach entrance, and Beach Bungalow…by the Sea is a single-level, Nantucket-style cottage just back from the Pacific on Bella Beach. You're minutes from Gleneden Beach, Fishing Rock, and the whale-watching at Depoe Bay — the self-proclaimed whale-watching capital of the Oregon coast.",
      "Every Lincoln Beach rental is booked direct with Step Away Lodging: better rates, no added service fees, and a local family who cares for the home themselves.",
    ],
    homeSlugs: ["americana", "americanas-paris-suite", "barefoot-bungalow", "barefoot-carriage-house", "beach-bungalow-by-the-sea"],
    localTitle: "Around Lincoln Beach",
    local: [
      { title: "Gleneden Beach", text: "A broad, walkable sandy beach just up the road, with Salishan's trails and shops nearby." },
      { title: "Depoe Bay", text: "The world's smallest navigable harbor and the whale-watching capital of the Oregon coast — resident gray whales are often just offshore." },
      { title: "Fishing Rock & tide pools", text: "Rocky headlands and tide pools full of sea stars and anemones at low tide, minutes from your door." },
      { title: "Steps to the sand", text: "Each of our Lincoln Beach homes is a short, easy walk to the beach — with a hot tub waiting when you get back." },
    ],
    faqs: [
      { q: "Where is Lincoln Beach, Oregon?", a: "Lincoln Beach is a quiet community on the central Oregon coast between Lincoln City and Depoe Bay, near Gleneden Beach. Our homes there are an easy walk to the sand." },
      { q: "How many people do your Lincoln Beach rentals sleep?", a: "From two guests in our romantic suites — like Americana's Paris Suite and the Barefoot Carriage House — up to ten in the Americana beach home. There's a fit for couples, families, and groups." },
      { q: "Do your Lincoln Beach cottages have hot tubs?", a: "Yes. Every Step Away Lodging home, including all of our Lincoln Beach cottages, has a private hot tub." },
    ],
  },
];

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

// The Property records for an area's featured homes, in the configured order.
export function areaHomes(area: Area): Property[] {
  return area.homeSlugs
    .map((slug) => properties.find((p) => p.slug === slug))
    .filter((p): p is Property => Boolean(p));
}
