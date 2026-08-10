// =============================================================================
// Lincoln City events — real recurring annual events on the central Oregon coast.
// Each has its own page at /events/<slug>. Dates are the best-known 2026 dates
// and can shift year to year — confirm on explorelincolncity.com before travel.
// Swap `theme.cover` for a real licensed photo path (in /public/events/) anytime.
// =============================================================================

export type LcEvent = {
  slug: string;
  title: string;
  dateLabel: string;
  sortKey: number; // month 1–12 for ordering; 0 = year-round (listed first)
  yearRound?: boolean;
  location: string;
  category: string;
  excerpt: string;
  body: string[];
  // Cover: a themed gradient + motif (no copyrighted photos). Drop a real photo
  // in /public/events/<slug>.jpg and set `photo` to use it instead.
  theme: { from: string; to: string; icon: string };
  photo?: string;
};

export const events: LcEvent[] = [
  {
    slug: "finders-keepers-glass-floats",
    title: "Finders Keepers Glass Float Hunt",
    dateLabel: "Year-round on the beach",
    sortKey: 0,
    yearRound: true,
    location: "Lincoln City beaches (7 miles of shoreline)",
    category: "Glass Floats",
    excerpt:
      "Hand-blown glass floats are hidden along the sand year-round — find one and it's yours to keep.",
    body: [
      "Since 1999, Lincoln City has hidden thousands of hand-blown glass floats along its seven miles of public beach. Volunteer \"Float Fairies\" tuck the colorful orbs above the high-tide line from October through Memorial Day, and finders keep what they discover.",
      "It's the longest-running treasure hunt on the Oregon Coast and the easiest way to turn a beach walk into an adventure — bring the kids, keep your eyes on the driftwood and dune grass, and you might head home with a one-of-a-kind souvenir.",
      "Staying at a Step Away Lodging home puts you steps from the sand, so you can head out at dawn when the floats are freshest and the beach is quiet.",
    ],
    theme: { from: "#0f766e", to: "#134e4a", icon: "float" },
  },
  {
    slug: "retro-expo",
    title: "Retro Expo — Antique & Vintage Week",
    dateLabel: "February 2026",
    sortKey: 2,
    location: "Shops citywide, Lincoln City",
    category: "Shopping",
    excerpt:
      "A ten-day, city-wide celebration of all things antique, vintage, and retro.",
    body: [
      "Every February, Lincoln City turns into a treasure hunt of a different kind. Retro Expo is a ten-day celebration of antiques and vintage finds, with sales and special displays at shops all over town.",
      "It's the perfect rainy-season excuse to browse, hunt for that perfect mid-century piece, and warm up with coffee between stops.",
    ],
    theme: { from: "#9a3412", to: "#7c2d12", icon: "vintage" },
  },
  {
    slug: "festival-of-illusions",
    title: "Festival of Illusions",
    dateLabel: "March 22–27, 2026",
    sortKey: 3,
    location: "Chinook Winds Casino Resort",
    category: "Family",
    excerpt:
      "A spring-break week of magicians, illusionists, and family-friendly shows.",
    body: [
      "A favorite spring-break tradition, the Festival of Illusions fills a week with magicians and illusionists performing family-friendly shows on the central Oregon coast.",
      "It's a great rainy-day plan and a memorable outing for kids and grown-ups alike, right in the heart of Lincoln City.",
    ],
    theme: { from: "#6d28d9", to: "#4c1d95", icon: "magic" },
  },
  {
    slug: "marie-lamfrom-float-drop",
    title: "Marie Lamfrom Glass Float Drop",
    dateLabel: "June 1–12, 2026",
    sortKey: 6,
    location: "Lincoln City beaches",
    category: "Glass Floats",
    excerpt:
      "A special early-summer drop of 130 specially marked glass floats.",
    body: [
      "On top of the year-round hunt, Lincoln City hosts special drops throughout the year. The Marie Lamfrom drop sends 130 specially marked floats onto the beaches in early June — each with its own sticker, float number, and glass stamp.",
      "Time your stay for the drop and join the fun of finding a collector's float with a story behind it.",
    ],
    theme: { from: "#0e7490", to: "#155e75", icon: "float" },
  },
  {
    slug: "summer-kite-festival",
    title: "Summer Kite Festival",
    dateLabel: "June 27–28, 2026",
    sortKey: 6,
    location: "Chinook Winds Casino Resort (2026)",
    category: "Kites",
    excerpt:
      "Giant kites — octopuses, whales, and dancing Rokkaku — fill the coastal sky.",
    body: [
      "One of Lincoln City's signature events, the Summer Kite Festival turns the sky into a moving gallery. Huge, colorful octopuses swim overhead, whales breach the clouds, and fast Rokkaku kites duel in the wind.",
      "It's free, it's family-friendly, and it's pure Oregon-coast magic. (For 2026, the festival moves to Chinook Winds Casino Resort while its usual beach site is under construction.)",
    ],
    theme: { from: "#0284c7", to: "#0369a1", icon: "kite" },
  },
  {
    slug: "sandcastle-contest",
    title: "Sandcastle Contest",
    dateLabel: "August 2026",
    sortKey: 8,
    location: "Siletz Bay, Lincoln City",
    category: "Family",
    excerpt:
      "Teams and families build elaborate sandcastles along Siletz Bay.",
    body: [
      "Late summer brings out the creativity as builders of all ages shape elaborate sandcastles along Siletz Bay. Enter a team or just come to watch the sculptures rise before the tide rolls in.",
      "Bring a bucket and a shovel — this one's as fun to join as it is to admire.",
    ],
    theme: { from: "#ca8a04", to: "#a16207", icon: "sandcastle" },
  },
  {
    slug: "nesika-illahee-powwow",
    title: "Nesika Illahee Pow-Wow",
    dateLabel: "Second weekend of August 2026",
    sortKey: 8,
    location: "Siletz, Oregon",
    category: "Culture",
    excerpt:
      "A vibrant celebration of drumming, dancing, and Native culture hosted by the Siletz Tribe.",
    body: [
      "Held on the second weekend of August, the Nesika Illahee Pow-Wow is a vibrant gathering of drumming, dancing, regalia, and community hosted by the Confederated Tribes of Siletz Indians.",
      "It's a moving, welcoming celebration of Native culture and a highlight of the coastal summer, a short drive inland from Lincoln City.",
    ],
    theme: { from: "#b91c1c", to: "#7f1d1d", icon: "drum" },
  },
  {
    slug: "fall-kite-festival",
    title: "Fall Kite Festival",
    dateLabel: "Late September 2026",
    sortKey: 9,
    location: "D River State Recreation Site, Lincoln City",
    category: "Kites",
    excerpt:
      "Giant kites by day and glowing illuminated kites at the Night Flight after dark.",
    body: [
      "The Fall Kite Festival brings the giant show-kites back to the beach — squid, whales, and Rokkaku dancing on the autumn wind. The weekend kicks off with the crowd-favorite Night Flight, when illuminated kites glow against the dark sky.",
      "Cooler air, smaller crowds, and dramatic skies make the fall festival a local favorite.",
    ],
    theme: { from: "#c2410c", to: "#9a3412", icon: "kite" },
  },
  {
    slug: "halloween-glass-float-drop",
    title: "Halloween Glow Float Drop",
    dateLabel: "October 30 – November 1, 2026",
    sortKey: 10,
    location: "Lincoln City beaches",
    category: "Glass Floats",
    excerpt:
      "Fifty glow-in-the-dark glass floats hidden on the beach for Halloween.",
    body: [
      "For Halloween, Lincoln City drops 50 special glow-in-the-dark glass floats along the beach. Hunt them by day, or bring a flashlight and watch them glow.",
      "It's a spooky-season twist on the classic hunt and a treat for the whole family over the long weekend.",
    ],
    theme: { from: "#7e22ce", to: "#581c87", icon: "moon" },
  },
  {
    slug: "restoration-powwow",
    title: "Restoration Pow-Wow",
    dateLabel: "Third Saturday of November 2026",
    sortKey: 11,
    location: "Chinook Winds Casino, Lincoln City",
    category: "Culture",
    excerpt:
      "The Siletz Tribe marks the restoration of its federal recognition with a community pow-wow.",
    body: [
      "Every third Saturday in November, the Confederated Tribes of Siletz Indians gather at Chinook Winds Casino to celebrate the 1977 restoration of the Tribe's federal recognition with a community pow-wow.",
      "Drumming, dancing, and regalia make it a powerful, welcoming event to close out the coastal year.",
    ],
    theme: { from: "#1d4ed8", to: "#1e3a8a", icon: "drum" },
  },
];

export const eventsByDate = [...events].sort((a, b) => a.sortKey - b.sortKey);

export function getEvent(slug: string): LcEvent | undefined {
  return events.find((e) => e.slug === slug);
}
