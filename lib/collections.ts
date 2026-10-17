// =============================================================================
// Topic / collection landing pages. Each renders an SEO page at /<slug> that
// groups homes by what guests actually search for ("large group", "hot tub",
// "oceanfront", "romantic"). Home lists are curated from real property data.
// =============================================================================

import { properties, type Property } from "@/lib/content";

export type Collection = {
  slug: string; // URL path
  name: string; // short label, e.g. "Large-Group"
  title: string; // SEO <title>
  description: string; // meta description
  eyebrow: string;
  heading: string; // H1
  subtitle: string;
  intro: string[]; // SEO body paragraphs
  homeSlugs: string[]; // featured homes, in display order
  homesHeading: string; // heading over the homes grid
  pointsTitle: string;
  points: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const collections: Collection[] = [
  {
    slug: "large-group-vacation-rentals-oregon-coast",
    name: "Large-Group",
    title: "Large-Group Vacation Rentals on the Oregon Coast (Sleeps 8–10)",
    description:
      "Oregon Coast vacation rentals for large groups and family reunions — homes that sleep 8 to 10 near Lincoln City, with big kitchens, multiple decks, and a private hot tub. Book direct.",
    eyebrow: "Vacation rentals · Large groups",
    heading: "Large-Group Oregon Coast Rentals",
    subtitle:
      "Family reunions, friends' trips, and multi-generation getaways — coastal homes that comfortably sleep 8 to 10, each with a private hot tub.",
    intro: [
      "Getting everyone together is half the fun of a coast trip — the whole family under one roof, meals around a big table, and the beach out the door. Our large-group Oregon Coast rentals are built for exactly that, with real bedrooms, plenty of bathrooms, open living and dining spaces, and multiple decks so a crowd never feels cramped.",
      "Ocean Peak Ridge spreads three floors of ocean views across sleeping for ten in the Olivia Beach community. Americana is a classic four-story beach house with four beach cruisers, and Ebb and Flow sits right on Siletz Bay with kayaks and crab traps. Barefoot Bungalow rounds it out with an open floor plan a short stroll from the sand. Traveling as a few families? Some of our homes sit side by side, so you can book neighboring houses and still share the evenings.",
    ],
    homeSlugs: ["ocean-peak-ridge", "americana", "ebb-and-flow", "barefoot-bungalow"],
    homesHeading: "Our homes that sleep 8–10",
    pointsTitle: "What makes a great group home",
    points: [
      { title: "Room to spread out", text: "Three to four bedrooms plus flexible living-space sleeping, so couples get real rooms and kids get their own space." },
      { title: "Kitchens & big tables", text: "Full kitchens and generous dining areas make group meals easy — cook in, or bring home fresh catch from the coast." },
      { title: "Decks & hot tubs", text: "Multiple ocean-view decks and a private hot tub in every home for winding down together at the end of the day." },
      { title: "Book neighboring homes", text: "Need even more room? Ask us about booking adjoining properties so a big group can stay close." },
    ],
    faqs: [
      { q: "What's the largest group your Oregon Coast rentals can sleep?", a: "Several of our homes sleep up to ten — including Ocean Peak Ridge, Americana, and Ebb and Flow. For bigger groups, ask us about booking neighboring homes together." },
      { q: "Do your large-group homes have enough bathrooms?", a: "Yes — our group homes have multiple bathrooms (two to three and a half) to keep mornings smooth for a full house." },
      { q: "Do the large-group rentals have hot tubs?", a: "Every Step Away Lodging home, including all of our large-group rentals, comes with a private hot tub." },
    ],
  },
  {
    slug: "oregon-coast-rentals-with-hot-tub",
    name: "Hot Tub",
    title: "Oregon Coast Vacation Rentals with Hot Tubs | Step Away Lodging",
    description:
      "Every Step Away Lodging vacation rental on the Oregon Coast comes with a private hot tub. Browse our Lincoln City–area homes and suites and book direct — better rates, no platform fees.",
    eyebrow: "Vacation rentals · Private hot tubs",
    heading: "Oregon Coast Rentals with a Hot Tub",
    subtitle:
      "Every single home in our collection comes with a private hot tub — the perfect end to a day on the sand.",
    intro: [
      "The Oregon coast is beautiful in every season, and often a little brisk — which is exactly why a private hot tub turns a good beach trip into a great one. After a windy walk on the sand or an afternoon chasing glass floats, there's nothing better than warming up under the coastal sky with the sound of the surf nearby.",
      "You don't have to hunt for the right amenity here: every Step Away Lodging home has its own private hot tub, from romantic suites for two to family houses that sleep ten. Many pair the soak with ocean-view decks, fireplaces, and fire pits for the full cozy-coast experience — and all of them book direct, with a local family to help.",
    ],
    homeSlugs: ["ocean-peak-ridge", "americana", "ebb-and-flow", "barefoot-bungalow", "beach-bungalow-by-the-sea", "americanas-paris-suite", "barefoot-carriage-house"],
    homesHeading: "All of our homes have a hot tub",
    pointsTitle: "Why a hot tub makes the trip",
    points: [
      { title: "Warm up after the beach", text: "Coastal days are breezy — a hot soak is the perfect way to thaw out after the sand and surf." },
      { title: "Stargaze on clear nights", text: "The coastal night sky is worth looking up for; many of our tubs sit on private ocean-view decks." },
      { title: "Storm-watch in comfort", text: "On a classic stormy Oregon night, a hot soak while the rain comes down is pure magic." },
      { title: "Every home, every stay", text: "No filtering required — a private hot tub is standard in all seven of our homes." },
    ],
    faqs: [
      { q: "Do all of your Oregon Coast rentals have hot tubs?", a: "Yes. Every home in the Step Away Lodging collection includes a private hot tub." },
      { q: "Are the hot tubs private?", a: "Yes — each hot tub is private to your home, typically on a back or ocean-view deck, not shared with other guests." },
      { q: "Can I book a hot-tub rental directly?", a: "Absolutely. Book any home directly at stepawaylodging.com for better rates, no extra platform fees, and local help." },
    ],
  },
  {
    slug: "oceanfront-vacation-rentals-oregon-coast",
    name: "Oceanfront",
    title: "Oceanfront & Ocean-View Vacation Rentals, Oregon Coast",
    description:
      "Wake up to the Pacific. Oceanfront and ocean-view vacation rentals near Lincoln City, Oregon — each with a private hot tub and book-direct rates. See the water from your deck.",
    eyebrow: "Vacation rentals · Ocean views",
    heading: "Oceanfront & Ocean-View Rentals",
    subtitle:
      "Homes where the Pacific — or the calm of Siletz Bay — is the view from your deck, each with a private hot tub.",
    intro: [
      "Some trips call for the ocean right there — waves to fall asleep to, water to wake up to, and a deck to watch the sun go down from. These Step Away Lodging homes put the view front and center, from sweeping Pacific horizons to the quiet of Siletz Bay.",
      "Ebb and Flow sits right on the bay with water views from the deck and kayaks at the ready. Ocean Peak Ridge offers west and southwest ocean views from all three floors in Olivia Beach. Beach Bungalow…by the Sea is just a few homes back from the Pacific on Bella Beach, and Americana's upper decks look out over the coastline. Every one comes with a private hot tub for soaking in the view.",
    ],
    homeSlugs: ["ebb-and-flow", "ocean-peak-ridge", "beach-bungalow-by-the-sea", "americana"],
    homesHeading: "Homes with ocean & bay views",
    pointsTitle: "Why an ocean-view stay",
    points: [
      { title: "The view is the amenity", text: "Big windows and ocean- or bay-facing decks make the water part of every morning and evening." },
      { title: "Sunsets from the deck", text: "West-facing decks mean front-row seats for the coast's famously good sunsets." },
      { title: "Water at your doorstep", text: "From Siletz Bay kayaking to a short walk to the Pacific surf, the water is never far." },
      { title: "Soak with a view", text: "Each home's private hot tub pairs the warm water with the sound of the sea." },
    ],
    faqs: [
      { q: "Which of your homes are oceanfront?", a: "Ebb and Flow is oceanfront on Siletz Bay, and Beach Bungalow…by the Sea sits just back from the Pacific on Bella Beach. Ocean Peak Ridge and Americana offer ocean views from their decks and upper floors." },
      { q: "Can I see the ocean from inside the homes?", a: "Yes — these homes are chosen for their water views, with ocean- or bay-facing windows and decks." },
      { q: "Do the ocean-view rentals have hot tubs?", a: "Yes, every one — so you can take in the view from a private hot tub." },
    ],
  },
  {
    slug: "romantic-oregon-coast-getaways",
    name: "Romantic",
    title: "Romantic Oregon Coast Getaways for Two | Step Away Lodging",
    description:
      "Romantic Oregon Coast getaways near Lincoln City — cozy suites and cottages for two with a private hot tub, fireplace, and the beach nearby. Book direct for your coastal escape.",
    eyebrow: "Vacation rentals · For two",
    heading: "Romantic Getaways for Two",
    subtitle:
      "Cozy suites and cottages made for couples — a private hot tub, a fireplace, and the Oregon coast at your door.",
    intro: [
      "Sometimes the best trip is the quiet one: just the two of you, a fire, and the sound of the surf. These Step Away Lodging homes are made for a romantic coastal escape — intimate spaces, a private hot tub, and the beach a short walk away.",
      "Americana's Paris Suite pairs a king bed and a cozy fireplace with a private deck and hot-tub access. The Barefoot Carriage House is a snug retreat for two with a queen bed and its own hot tub. And Beach Bungalow…by the Sea is a single-level Nantucket-style cottage just back from the Pacific — easy, warm, and wonderfully quiet. Book direct and let us help you plan a getaway to remember.",
    ],
    homeSlugs: ["americanas-paris-suite", "barefoot-carriage-house", "beach-bungalow-by-the-sea"],
    homesHeading: "Cozy homes for couples",
    pointsTitle: "Made for a couples' escape",
    points: [
      { title: "Intimate & private", text: "Suites and cottages sized for two, with private entrances and decks for a quiet retreat." },
      { title: "Hot tub & fireplace", text: "Warm up by the fire and unwind in a private hot tub after a day on the coast." },
      { title: "Steps to the beach", text: "The Pacific and seven miles of Oregon coastline are a short stroll away." },
      { title: "We'll help you plan", text: "Tell us the occasion and we'll help make your coastal getaway special." },
    ],
    faqs: [
      { q: "Do you have vacation rentals for just two people?", a: "Yes — Americana's Paris Suite and the Barefoot Carriage House are cozy retreats built for two, and Beach Bungalow…by the Sea is a relaxed single-level cottage perfect for couples." },
      { q: "Are these romantic rentals private?", a: "Yes. The suites have private entrances and decks, and each home has its own private hot tub." },
      { q: "Do the couples' rentals have hot tubs and fireplaces?", a: "Each one has a private hot tub, and our couples' favorites pair it with a cozy fireplace." },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function collectionHomes(c: Collection): Property[] {
  return c.homeSlugs
    .map((slug) => properties.find((p) => p.slug === slug))
    .filter((p): p is Property => Boolean(p));
}
