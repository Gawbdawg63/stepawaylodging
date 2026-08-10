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
  {
    slug: "things-to-do-in-lincoln-city-oregon",
    title: "Things to Do in Lincoln City, Oregon: A Local's Guide",
    date: "2026-07-28",
    author: "Step Away Lodging",
    excerpt:
      "Beaches, glass floats, kite festivals, tide pools, chowder, and more — how to spend a perfect few days on the central Oregon coast.",
    cover: "events/kite-festival.jpg",
    body: [
      "Lincoln City packs a lot of Oregon coast into seven miles of shoreline. Whether you're here for a long weekend or a full week, there's an easy rhythm to a great stay: beach in the morning, a good meal midday, and something memorable in the afternoon. Here's how we'd spend it.",
      "Start on the sand. The beach is the main event, and it's wonderful year-round — long walks, tide pools at low tide, driftwood forts, and the famous Finders Keepers glass-float hunt, where hand-blown floats are hidden along the beach for you to keep. Kite flying is practically a local sport thanks to the steady coastal wind, and twice a year the sky fills with giant show-kites at the Summer and Fall Kite Festivals.",
      "When you're ready to warm up, Lincoln City's food scene punches above its weight: fresh Pacific seafood and clam chowder, cozy coffee roasters and bakeries, and casual spots with a view. Rainy day? Browse the antique and vintage shops (they take over the whole town during February's Retro Expo), catch a show at Chinook Winds Casino Resort, or explore Devil's Lake for kayaking and paddleboarding.",
      "Beyond town, the central coast opens up: whale-watching in Depoe Bay (the self-proclaimed whale-watching capital of the Oregon coast), the trails and dramatic headland of Cascade Head, tide pools and lighthouses down toward Newport, and the dory boats of Pacific City to the north. Nearly all of it is within an easy drive.",
      "Best of all, every Step Away Lodging home has a hot tub — so however you spend the day, there's a warm soak and an ocean breeze waiting when you get back. Browse our homes and start planning your Lincoln City escape.",
    ],
  },
  {
    slug: "oregon-coast-vacation-rentals-with-hot-tub",
    title: "Oregon Coast Vacation Rentals with a Hot Tub",
    date: "2026-07-10",
    author: "Step Away Lodging",
    excerpt:
      "There's nothing like a soak under the coastal sky after a day on the sand. Every Step Away Lodging home comes with a private hot tub.",
    cover: "photos/photo-03.jpg",
    body: [
      "The Oregon coast is beautiful in every season — and often a little brisk. That's exactly why a private hot tub turns a good beach trip into a great one. After a windy walk on the sand or an afternoon chasing glass floats, there's nothing better than warming up under the stars with the sound of the surf in the background.",
      "It's a small thing that changes the whole feel of a stay. Couples love it for a quiet, romantic evening; families love it for warming up the kids after the beach; and on a classic stormy Oregon night, a hot soak while the rain comes down is pure magic.",
      "Every single home in the Step Away Lodging collection comes with a private hot tub — from romantic suites for two like Americana's Paris Suite and the Barefoot Carriage House, to family houses that sleep ten like Ocean Peak Ridge, Americana, and Ebb and Flow. Many also pair the hot tub with ocean-view decks, fireplaces, and fire pits for the full cozy-coast experience.",
      "Ready to plan your soak? Browse our homes, check your dates, and book direct — and don't forget to look up once you're in the water. The coastal night sky is worth it.",
    ],
  },
  {
    slug: "pet-friendly-oregon-coast-getaway",
    title: "Planning a Pet-Friendly Oregon Coast Getaway",
    date: "2026-06-25",
    author: "Step Away Lodging",
    excerpt:
      "The Oregon coast is one of the most dog-friendly places around. Here's how to plan a trip your whole family — furry members included — will love.",
    cover: "homes/ebb-and-flow.jpg",
    body: [
      "Few places welcome dogs like the Oregon coast. Miles of open, leash-friendly beach, easy trails, and a relaxed, come-as-you-are attitude make it one of the best spots around for a getaway with your pup. If your family includes a four-legged member, the coast is calling.",
      "The beach is the star. Dogs are welcome on Oregon's public beaches (keep them leashed and pick up after them), and there's endless room to run, splash in the surf, and chase driftwood. Beyond the sand, you'll find dog-friendly trails, patios, and shops throughout Lincoln City and the surrounding towns.",
      "A few tips for a smooth trip: bring a towel (or three) for sandy paws, pack your dog's food and a favorite blanket, and check tide tables so you catch the beach at its widest. Early mornings and late afternoons are the calmest times for a walk.",
      "We keep pet-friendly homes in our collection so your whole family can come along — just look for the pet-friendly note when you book, and review the simple pet policy (leashed, not left unattended, one dog with a 50 lb limit). Browse our homes to find the right fit, and we'll see you — and your dog — on the sand.",
    ],
  },
];

export const postsByDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
