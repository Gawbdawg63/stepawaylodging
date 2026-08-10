// =============================================================================
// Blog posts. Add a new entry to publish a post at /blog/<slug>.
// `cover` is an optional image path under /public (e.g. "photos/photo-14.jpg").
// =============================================================================

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO, e.g. "2026-08-01"
  author: string;
  excerpt: string;
  cover?: string;
  body: string[]; // paragraphs
};

export const posts: BlogPost[] = [
  {
    slug: "book-direct-with-step-away-lodging",
    title: "Why Book Direct with Step Away Lodging",
    date: "2026-08-05",
    author: "Step Away Lodging",
    excerpt:
      "Skip the platform fees and book straight through us — better rates, real local help, and homes we care for ourselves.",
    cover: "photos/photo-14.jpg",
    body: [
      "When you book one of our homes directly at stepawaylodging.com, you're dealing with the people who actually care for the property — not a faceless platform. That means better rates without the extra service fees, and a real person to call if you need anything during your stay.",
      "Every Step Away Lodging home is locally managed and personally looked after. We know which beach access is closest, where to grab the best clam chowder, and when the tide is right for finding glass floats.",
      "Booking direct also means flexibility. Have a question before you reserve? Just send us an inquiry — we're happy to help you pick the home that fits your group.",
    ],
  },
  {
    slug: "glass-floats-guide-lincoln-city",
    title: "A Local's Guide to Finding Glass Floats in Lincoln City",
    date: "2026-07-20",
    author: "Step Away Lodging",
    excerpt:
      "Lincoln City hides hand-blown glass floats on the beach year-round. Here's how to find one.",
    cover: "photos/photo-06.jpg",
    body: [
      "Since 1999, Lincoln City has hidden thousands of hand-blown glass floats along its seven miles of public beach. Find one above the high-tide line and it's yours to keep — the longest-running treasure hunt on the Oregon Coast.",
      "The best time to hunt is early morning, especially after a high tide or a bit of wind, which shifts the sand and driftwood where floats like to hide. Walk slowly, scan the base of the dune grass and driftwood, and bring the kids — they're often the best spotters.",
      "Staying in a beachfront Step Away Lodging home gives you a head start: you can be on the sand at first light, before the crowds, when the floats are freshest. Watch the Explore Lincoln City calendar for special drops throughout the year, too.",
    ],
  },
];

export const postsByDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
