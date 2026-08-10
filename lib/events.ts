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
      "Since 1999, Lincoln City has turned its shoreline into the longest-running treasure hunt on the Oregon Coast. Local artists hand-blow thousands of glass floats, and volunteer \"Float Fairies\" tuck the colorful orbs above the high-tide line along seven miles of public beach from mid-October through Memorial Day.",
      "The rules are wonderfully simple: if you find a float resting in the sand, the driftwood, or the dune grass, it's yours to keep. Each one is unique — swirled with color and marked with the year — so no two finds are ever alike. Register your float online and you'll even learn a little about the artist who made it.",
      "Half the fun is the hunt itself. Early mornings after a high tide or a bit of wind are prime time, when shifting sand reveals fresh hiding spots and the beach is still quiet. Bring the kids — they're often the sharpest spotters — and take your time; the floats reward a slow, wandering walk.",
      "Staying in a Step Away Lodging home puts you right on the doorstep of the sand, so you can be out at first light before the crowds. And even if you don't find a float, a sunrise beach walk with coffee in hand is never a bad way to start the day.",
    ],
    theme: { from: "#0f766e", to: "#134e4a", icon: "float" },
    photo: "events/glass-floats.jpg",
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
      "Every February, Lincoln City trades beach umbrellas for a treasure hunt of a different kind. Retro Expo is a ten-day, city-wide celebration of antiques, vintage finds, and mid-century treasures, with special sales and displays at shops all over town.",
      "It's a browser's paradise. Wander from store to store hunting for that perfect piece — vintage glassware, retro furniture, coastal collectibles, or a quirky bit of Americana — and swap stories with the friendly dealers who make the coast's antique scene so welcoming.",
      "With the winter surf crashing outside, it's the perfect rainy-season plan: poke through shops at your own pace, warm up with coffee or chowder between stops, and head back to your home base with a one-of-a-kind find. Pair it with a stormy-day fire and a soak in the hot tub, and you've got a cozy coastal weekend.",
    ],
    theme: { from: "#9a3412", to: "#7c2d12", icon: "vintage" },
    photo: "events/retro-expo.jpg",
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
      "A beloved spring-break tradition on the central Oregon coast, the Festival of Illusions fills a full week with magicians, illusionists, and variety performers putting on family-friendly shows at Chinook Winds Casino Resort.",
      "Expect close-up sleight of hand, grand stage illusions, comedy, and plenty of audience participation — the kind of jaw-dropping, how-did-they-do-that entertainment that delights kids and grown-ups alike.",
      "It's an ideal rainy-day plan during spring break: catch a show, explore the resort, and make an easy afternoon of it. With a Step Away Lodging home just minutes away, you can head back to unwind — or out to the beach — whenever the mood strikes.",
    ],
    theme: { from: "#6d28d9", to: "#4c1d95", icon: "magic" },
    photo: "events/festival-of-illusions.jpg",
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
      "On top of the year-round Finders Keepers hunt, Lincoln City hosts a handful of special glass-float drops throughout the year — and the Marie Lamfrom drop is one of the most anticipated. In early June, 130 specially marked floats are released onto the beaches.",
      "These aren't your everyday floats: each carries its own sticker, a numbered float tag, and a unique glass stamp, making them prized finds for collectors and first-timers alike. The extra floats mean better odds, too, so it's a great window to try your luck.",
      "Time your stay around the drop and you'll have a full stretch of early-summer beach days to comb the sand. Head out early, keep your eyes on the wrack line, and you might just carry home a keepsake with a story behind it.",
    ],
    theme: { from: "#0e7490", to: "#155e75", icon: "float" },
    photo: "events/glass-float-drop.jpg",
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
      "One of Lincoln City's signature events, the Summer Kite Festival turns the coastal sky into a moving gallery. Professional kite fliers from around the world launch enormous show-kites — colorful octopuses swimming overhead, whales breaching the clouds, and long spinning creatures that ripple in the ocean breeze.",
      "Between the giant inflatables, teams fly fast, acrobatic Rokkaku kites in choreographed battles, dipping and diving on the steady coastal wind. There are candy drops for the kids, flying demonstrations, and plenty of space to launch a kite of your own.",
      "Best of all, it's completely free and endlessly family-friendly — just bring a blanket, a windbreaker, and your sense of wonder. (For 2026, the festival moves to Chinook Winds Casino Resort while its usual beach site is under construction.)",
      "With a home nearby, you can wander down for the show, duck back for lunch or a hot-tub break, and return for the afternoon session without missing a beat.",
    ],
    theme: { from: "#0284c7", to: "#0369a1", icon: "kite" },
    photo: "events/kite-festival.jpg",
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
      "Late summer brings out the coast's creative side as builders of all ages gather along Siletz Bay to shape elaborate sandcastles and sculptures. From towering castles to whimsical sea creatures, the beach becomes an open-air gallery for a few sun-soaked hours.",
      "Enter a team and compete, or simply stroll the sand and watch the creations rise — it's as fun to admire as it is to join. The relaxed, come-one-come-all spirit makes it a favorite for families.",
      "All you really need is a bucket, a shovel, and a little imagination. Build your masterpiece before the tide rolls in to reclaim it, then cap the day with a beach picnic and a sunset walk back to your home.",
    ],
    theme: { from: "#ca8a04", to: "#a16207", icon: "sandcastle" },
    photo: "events/sandcastle-contest.jpg",
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
      "Held on the second weekend of August, the Nesika Illahee Pow-Wow is a vibrant, welcoming gathering hosted by the Confederated Tribes of Siletz Indians. \"Nesika Illahee\" means \"our land\" — and the celebration honors the deep roots of Native culture on this coast.",
      "The heart of the pow-wow is the dance arena, where dancers in stunning regalia move to the powerful rhythm of the drum. You'll find grand entries, intertribal dancing, singing, traditional foods, and artisan vendors sharing handmade crafts and jewelry.",
      "Visitors are warmly welcomed to attend, watch, and learn — it's a meaningful, memorable experience and a highlight of the coastal summer. The grounds in Siletz are a short, scenic drive inland from Lincoln City, easy to fold into a weekend stay.",
    ],
    theme: { from: "#b91c1c", to: "#7f1d1d", icon: "drum" },
    photo: "events/pow-wow.jpg",
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
      "When autumn's steady winds arrive, the giant show-kites return to the beach for the Fall Kite Festival. Enormous squid, whales, and creatures of every color fill the sky by day, while teams fly fast, acrobatic Rokkaku kites in choreographed duels on the crisp coastal air.",
      "The weekend kicks off with the crowd-favorite Night Flight, when illuminated kites glow against the dark sky in a mesmerizing after-dark display — a magical sight you won't find at many festivals.",
      "Cooler temperatures, smaller crowds, and dramatic fall skies make this a local favorite — arguably even better than the summer edition. Bring a warm jacket and a thermos.",
      "With a Step Away Lodging home nearby, you can catch the day flights, warm up indoors, and head back out for the glowing Night Flight — then round off the evening with a soak in the hot tub.",
    ],
    theme: { from: "#c2410c", to: "#9a3412", icon: "kite" },
    photo: "events/kite-festival.jpg",
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
      "For Halloween, Lincoln City adds a spooky-season twist to its famous glass-float hunt: 50 special glow-in-the-dark floats are dropped along the beach over the long weekend.",
      "Hunt them by day like the classic floats, or — for the real fun — bring a flashlight at dusk, \"charge\" the glass in the beam, and watch the floats glow softly against the dark sand. It's an unforgettable treat for kids and a genuinely magical way to spend a fall evening.",
      "Pair the hunt with the coast's cozy Halloween spirit — costumes, small-town trick-or-treating, and stormy-night fires — and you've got a memorable holiday getaway. Staying steps from the beach makes those after-dark glow hunts easy.",
    ],
    theme: { from: "#7e22ce", to: "#581c87", icon: "moon" },
    photo: "events/glass-float-drop.jpg",
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
      "Every third Saturday in November, the Confederated Tribes of Siletz Indians gather at Chinook Winds Casino to celebrate a landmark day: the 1977 restoration of the Tribe's federal recognition. The Restoration Pow-Wow honors that hard-won milestone with community, tradition, and pride.",
      "The celebration fills the arena with the heartbeat of the drum, dancers in intricate regalia, singing, and grand entries, alongside Native food and artisan vendors. It's a powerful, joyful, and deeply welcoming event.",
      "Open to visitors, it's a moving way to close out the coastal year and connect with the living culture of this land. Held right in Lincoln City, it pairs easily with a late-autumn coastal escape.",
    ],
    theme: { from: "#1d4ed8", to: "#1e3a8a", icon: "drum" },
    photo: "events/pow-wow.jpg",
  },
];

export const eventsByDate = [...events].sort((a, b) => a.sortKey - b.sortKey);

export function getEvent(slug: string): LcEvent | undefined {
  return events.find((e) => e.slug === slug);
}
