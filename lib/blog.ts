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
  {
    slug: "whale-watching-oregon-coast-when-and-where",
    title: "Whale Watching on the Oregon Coast: When & Where",
    date: "2026-09-11",
    author: "Step Away Lodging",
    excerpt:
      "Gray whales pass right by Lincoln City — and some stay all summer. Here's when to look, where to go, and how to spot them.",
    cover: "hero.jpg",
    body: [
      "One of the best things about a stay on the central Oregon coast is that whale watching is often as simple as looking up from the beach. Gray whales travel this stretch of coastline in the thousands, and with a little timing you have an excellent chance of seeing a spout, a fluke, or a barnacled back breaking the surface.",
      "There are two big migrations each year. In late December, around 18,000 gray whales head south toward Baja — the peak falls right around the week between Christmas and New Year's. Then in late March, they come back north with their calves, hugging the shore even closer as they go. Oregon celebrates both with Whale Watch Week, when trained volunteers set up at lookout points up and down the coast to help you spot them.",
      "The real secret, though, is summer. A group of roughly 200 'resident' gray whales skips the long trip to Alaska and feeds just offshore from about mid-June through mid-November — which means you can watch whales on a warm, calm day, not only in the winter surf. Depoe Bay, a short drive south of Lincoln City, calls itself the whale-watching capital of the Oregon coast, with a free Whale Watching Center right on the seawall and boat tours that head out from the world's smallest navigable harbor.",
      "To spot them yourself: pick a clear day, find a high vantage point or an ocean-view deck, bring binoculars, and scan the horizon slowly for the puff of a spout — that's usually what you see first. Early morning, when the water is calm, tends to be best.",
      "Many of our homes look straight out at the water, so you can pour a coffee, step onto the deck, and start scanning without leaving the house. Browse our ocean-view homes and plan your whale-watching escape.",
    ],
  },
  {
    slug: "beachfront-vs-ocean-view-oregon-coast-rental",
    title: "Beachfront vs. Ocean-View: Choosing Your Coast Rental",
    date: "2026-09-08",
    author: "Step Away Lodging",
    excerpt:
      "'Oceanfront,' 'ocean view,' 'steps to the sand' — the labels can be confusing. Here's what they really mean, so you book the stay you're picturing.",
    cover: "photos/photo-11.jpg",
    body: [
      "When you're browsing coast rentals, the location words all start to blur together — oceanfront, ocean view, beachfront, steps to the sand. They describe genuinely different experiences, and knowing the difference is the easiest way to make sure the home matches what you're imagining.",
      "'Oceanfront' or 'beachfront' means the property sits right on the beach or bluff, with the sand just outside — often with private or community beach access a short walk away. 'Ocean view' means you can see the water from the home, though there may be a road, a row of houses, or a short walk between you and the sand. Both can be wonderful; they just suit different trips.",
      "Ask yourself how you'll spend your days. If you want to walk straight out to the beach with the kids, hunt for glass floats at first light, or fall asleep to the surf, prioritize being close to the sand. If you'd rather have a big, comfortable home with a sweeping view to enjoy from the deck or hot tub — and don't mind a short stroll to the water — an ocean-view home often gives you more house for the money and a higher, wider outlook.",
      "A few things to check either way: which direction the home faces (west and southwest catch the sunset over the water), how many steps or what kind of path leads to the beach, and whether the view is from the main living area or just a bedroom. We describe each home honestly on its page, with a map of the general area and photos of the actual outlook.",
      "Not sure which of our homes fits your group? Send us an inquiry — we know each one personally and we're happy to point you to the right one. Browse our homes to compare.",
    ],
  },
  {
    slug: "storm-watching-lincoln-city-oregon",
    title: "Storm Watching in Lincoln City: The Coast's Cozy Secret",
    date: "2026-09-04",
    author: "Step Away Lodging",
    excerpt:
      "Winter on the Oregon coast is dramatic, moody, and surprisingly cozy. Here's how to enjoy storm season from the warm side of the window.",
    cover: "photos/photo-12.jpg",
    body: [
      "Ask a local for their favorite season on the Oregon coast and plenty will tell you: winter. From about November through February, big Pacific storms roll in and put on a show — towering waves, wind-whipped spray, driftwood tossed high on the sand, and skies that shift from silver to gold in minutes. It's raw and beautiful, and the crowds are long gone.",
      "The trick is to enjoy it from the warm side of the glass. A home with an ocean view, a fireplace, and a hot tub turns a stormy night into the coziest getaway of the year: watch the waves crash while you're wrapped in a blanket, then step out for a soak with the rain coming down and the surf roaring below. It's the kind of evening people drive hours for.",
      "Time your visit around a 'king tide' — the year's highest tides, which stack up with winter swells for the most dramatic surf — and keep an eye on the forecast for the day after a storm, when the beach is scattered with fresh driftwood and, often, more glass floats than usual. Just watch the water from a safe distance: never turn your back on the ocean, and steer clear of logs in the swash zone.",
      "Bundle up for a bracing walk between squalls, warm up with a bowl of clam chowder in town, and settle in for the evening light show. It's the Oregon coast at its most cinematic.",
      "Every Step Away Lodging home has a hot tub, and many pair it with a fireplace and ocean views — the perfect base for storm season. Browse our homes and book your cozy winter escape.",
    ],
  },
  {
    slug: "weekend-in-bend-from-the-oregon-coast",
    title: "Coast to High Desert: A Weekend in Bend",
    date: "2026-08-30",
    author: "Step Away Lodging",
    excerpt:
      "Oregon packs the ocean and the high desert into one road trip. Here's how to pair a coast stay with a weekend in Bend and central Oregon.",
    cover: "bend.jpg",
    body: [
      "One of the joys of an Oregon trip is how much changes in a few hours of driving. Leave the misty coast, climb over the Cascades, and you drop into the high desert around Bend — all sunshine, ponderosa pines, volcanic rock, and the sparkling Deschutes River. It makes for a fantastic two-part vacation: salt air one half, alpine light the other.",
      "Bend is an outdoor-lover's basecamp. In summer, float the Deschutes right through town, hike among the lakes and waterfalls of the Cascade Lakes Scenic Byway, or scramble the trails at Smith Rock State Park, one of the birthplaces of American rock climbing. In winter, Mt. Bachelor delivers some of the best skiing and riding in the Northwest. Year-round, the town itself is famous for its breweries — the Bend Ale Trail strings together more than a dozen of them.",
      "It's an easy add-on to a coast stay. Plan a scenic drive over the mountains (the passes are gorgeous, and you'll want to check winter road conditions), spend a couple of nights exploring the high desert, then loop back to the ocean — or the other way around. Kids love the High Desert Museum and the lava caves at Newberry National Volcanic Monument.",
      "Step Away Lodging is growing into central Oregon, so you can enjoy the same personal, locally-managed hospitality on both sides of the mountains. Explore our Central Oregon page to see what's coming, and browse our coast homes to plan the ocean half of your trip.",
    ],
  },
  {
    slug: "three-day-lincoln-city-itinerary",
    title: "The Perfect 3-Day Lincoln City Itinerary",
    date: "2026-08-26",
    author: "Step Away Lodging",
    excerpt:
      "Only have a long weekend? Here's a relaxed, local-approved plan for three perfect days on the central Oregon coast.",
    cover: "events/sandcastle-contest.jpg",
    body: [
      "Three days is just enough to fall for the central Oregon coast. This is the unhurried, local rhythm we'd recommend — beach mornings, good food, and one memorable outing a day, with plenty of time to do nothing at all.",
      "Day one: settle in and go straight to the sand. Take a long walk on Lincoln City's seven miles of beach, hunt for a hand-blown glass float along the high-tide line, and let the kids build a driftwood fort. Grab clam chowder for lunch, pick up groceries for the house, and spend the evening watching the sunset from the deck before a soak in the hot tub.",
      "Day two: explore a little farther. Drive south to Depoe Bay to look for whales from the seawall, tour the tide pools and lighthouse near Newport, or head to the Connie Hansen Garden and the shops in town if the weather turns. Fly a kite in the afternoon wind — it's practically the local sport — then come home to warm up.",
      "Day three: pick your pace. Rent a paddleboard or kayak on Devil's Lake, browse the antique and vintage shops, or simply have a slow beach morning before checkout. Squeeze in one more chowder and one more walk on the sand for the road.",
      "The beauty of staying in a home base with a kitchen and a hot tub is that you set the tempo — no rushing, no crowds, just the coast on your schedule. Browse our homes and start planning your three days.",
    ],
  },
  {
    slug: "best-oregon-coast-rentals-for-large-groups",
    title: "The Best Oregon Coast Rentals for Large Groups",
    date: "2026-08-22",
    author: "Step Away Lodging",
    excerpt:
      "Family reunion, friends' trip, or a multi-generation getaway? Here's how to pick a coast home that fits everyone — comfortably.",
    cover: "photos/photo-13.jpg",
    body: [
      "There's something special about getting everyone together on the coast — the whole family under one roof, meals around a big table, and the beach out the door. Booking for a large group just takes a little more planning, and the right home makes all the difference between cramped and carefree.",
      "Start with how people actually sleep. Look past the headline 'sleeps 10' and check the bedroom count and bed types, so couples have real bedrooms and kids have their own space. Bathrooms matter just as much for a big group — the more, the smoother your mornings. Then think about the gathering spaces: an open living and kitchen area, a large dining table, and outdoor decks are what make a group home feel generous instead of tight.",
      "A few of our homes are built for exactly this. Ocean Peak Ridge spreads three floors of living and ocean views across sleeping for ten. Americana and Ebb and Flow are roomy family houses with big kitchens and plenty of common space — and every one comes with a hot tub for winding down together at the end of the day. Traveling as two couples or a few families? Some of our properties sit right next to each other, so you can book neighboring homes and still share the beach and the evenings.",
      "Our best advice: tell us about your group and we'll help you match the right home — or the right combination of homes. We manage each one personally, so we know which layout suits a reunion, a friends' weekend, or a multi-generation holiday.",
      "Browse our homes to see the whole collection, or send us an inquiry and we'll help you gather everyone on the coast.",
    ],
  },
  {
    slug: "should-you-hire-a-vacation-rental-property-manager",
    title: "Should You Hire a Property Manager for Your Vacation Rental?",
    date: "2026-08-16",
    author: "Step Away Lodging",
    excerpt:
      "Thinking about renting out your Oregon coast home? Here's an honest look at what a property manager actually does — and when it's worth it.",
    cover: "photos/photo-05.jpg",
    body: [
      "Owning a vacation home on the Oregon coast is a wonderful thing — and turning it into a short-term rental can help it pay for itself. But managing that rental well is a real job. Before you decide to go it alone or bring in help, it's worth understanding everything the work actually involves.",
      "A good property manager handles the whole guest journey: professional photos and listings, pricing that flexes with the seasons, bookings and calendars across every platform, guest communication at all hours, cleaning and laundry between stays, restocking, routine maintenance, and the inevitable 'the hot tub isn't heating' call at 9pm. Done right, it means more bookings, better reviews, higher nightly rates — and none of the late-night texts landing on you.",
      "The question to ask isn't just 'what does it cost?' but 'what is my time and peace of mind worth?' If you live nearby, love hosting, and have the hours to spare, self-managing can work. If you're out of the area, short on time, or simply want to enjoy owning the home without running a small hospitality business, a local manager usually more than pays for itself in occupancy, rates, and stress saved.",
      "That's exactly what we do. Step Away Lodging is a family-owned team with more than 30 years on the Oregon coast, and we treat every owner's home like our own — full-service management, personal attention, and guests who leave five-star reviews. We handle everything; you collect the income and keep the peace of mind.",
      "Curious what your home could do? Visit our For Owners page or reach out for a no-pressure conversation about your property.",
    ],
  },
  {
    slug: "where-to-eat-in-lincoln-city-oregon",
    title: "Where to Eat in Lincoln City: Chowder, Seafood & More",
    date: "2026-09-01",
    author: "Step Away Lodging",
    excerpt:
      "Fresh Pacific seafood, legendary clam chowder, cozy bakeries and brewpubs — a local's take on eating well in Lincoln City.",
    cover: "photos/photo-07.jpg",
    body: [
      "Sea air has a way of making you hungry, and Lincoln City delivers. For a town of its size, the food scene punches well above its weight — built around the fresh Pacific seafood landed just down the coast, plus a growing cast of bakeries, coffee roasters, food carts, and brewpubs. Here's how we'd eat our way through a stay.",
      "Start with chowder, because you have to. Clam chowder is the coast's signature comfort food, and you'll find rich, steaming bowls of it all over town — including at Mo's, the beloved Oregon institution that's been serving the coast since 1946. Pair it with fish and chips or a fresh Dungeness crab roll and you've got the perfect post-beach lunch.",
      "For dinner, you're spoiled for fresh seafood — halibut, salmon, rockfish, oysters, and crab straight from local waters — alongside options for every mood, from casual family spots to a nicer night out with an ocean view. Grab-and-go is easy too: pick up fresh catch from a seafood market and cook it back at the house (every one of our homes has a full kitchen), or graze the food carts for a low-key evening.",
      "Don't skip breakfast and the in-between moments: local coffee roasters and cozy bakeries make for a slow, happy start to a beach day, and the area's brewpubs and tasting rooms are a fine way to end one. Rainy afternoon? The restaurants at Chinook Winds Casino Resort sit right on the beach, so you can watch the waves while you eat.",
      "Menus and hours change with the seasons on the coast, so when in doubt, just ask us — we live here and we're always happy to point you to what's good right now. Browse our homes to plan your stay, and come hungry.",
    ],
  },
  {
    slug: "beachcombing-oregon-coast-agates-sea-glass-driftwood",
    title: "Beachcombing the Oregon Coast: Agates, Sea Glass & Driftwood",
    date: "2026-09-14",
    author: "Step Away Lodging",
    excerpt:
      "Long before the glass-float hunt, beachcombers came to the Oregon coast for agates, sea glass, and driftwood. Here's how to find your own treasures on the sand.",
    cover: "homes/beach-bungalow-by-the-sea.jpg",
    body: [
      "There's a particular kind of quiet joy in walking the beach with your eyes on the sand instead of the horizon. Oregon's beaches are all public land, protected for everyone to walk and explore under the state's 1967 Beach Bill, so there's no shortage of shoreline to search — just seven miles of it right here in Lincoln City, and hundreds more up and down the coast.",
      "Agates are the classic prize. These translucent quartz stones wash out of eroding headlands and get tumbled smooth by the surf, often turning up in patches of small gravel near river mouths and rocky points. The trick locals swear by: get down low and look toward the light. Wet agates catch and glow where opaque rocks stay dull, so a bright patch in a field of gray pebbles is usually worth a second look. Newport's own Agate Beach earned its name honestly, but you'll find them scattered along much of the central coast too.",
      "Driftwood is the other constant. Whole logs and sun-bleached branches pile up above the tideline all winter, perfect for building a fort with the kids, or just hauling home a striking piece for the mantle. Sea glass turns up less often on the Pacific than on some other coastlines, but it does happen — old bottle glass, worn frosty and soft-edged by years in the surf, is a genuine little thrill when you spot it.",
      "Timing matters more than luck. The best hunting tends to follow a storm or a big tide, when the surf has reworked the beach and turned up material that's been buried for months. Early morning, right after low tide, is prime time — the sand is freshly rinsed and you'll beat both the crowds and the next high water. Bring a small bag, keep an eye on the surf line (never turn your back on the ocean), and if you find a live sand dollar — gray or purple and slightly fuzzy, rather than bleached white — the kind thing is to leave it right where the water can reach it.",
      "A beachcombing walk pairs perfectly with a slow coastal stay: no schedule to keep, just tide charts and curiosity. Come back to a warm home, rinse off your finds on the deck, and settle into the hot tub while you sort through the day's haul. Browse our homes and book direct at stepawaylodging.com for your next treasure hunt on the sand.",
    ],
  },
  {
    slug: "fall-mushroom-foraging-oregon-coast",
    title: "Fall Mushroom Foraging on the Oregon Coast",
    date: "2026-09-21",
    author: "Step Away Lodging",
    excerpt:
      "When the fall rains return, the forests behind Lincoln City come alive with mushrooms. Here's a beginner-friendly guide to foraging season on the Oregon coast.",
    cover: "photos/photo-09.jpg",
    body: [
      "There's a particular kind of magic that settles over the coast once the fall rains arrive. The crowds thin out, the light turns soft and golden in the afternoons, and just inland, the damp forest floor along the Coast Range starts to wake up. For anyone who loves a reason to get outside in the cooler months, mushroom season is one of the central coast's best-kept secrets.",
      "The star of the show is the Pacific golden chanterelle, Oregon's official state mushroom. These trumpet-shaped beauties range from pale yellow to deep gold, with wavy, ruffled caps and forking, gill-like ridges running down the stem rather than true gills. They favor the mossy floor of Douglas fir, western hemlock, and Sitka spruce forests, and they tend to appear in the same general spots year after year once the ground has had a good soaking from the season's first steady rains.",
      "If you're new to foraging, the single most important rule is simple: never eat a wild mushroom you can't identify with complete confidence. Some toxic species can look surprisingly similar to good edibles to an untrained eye, and the consequences of a mistake range from an upset stomach to much worse. The safest way to start is to go out with an experienced forager, join a guided walk through a local mycological or naturalist group, or simply treat your first outings as a scouting mission and leave the tasting for another day. If you're foraging on public land, it's also worth checking with the local ranger district beforehand, since personal-use rules and seasonal closures can vary from forest to forest.",
      "You don't need much gear to get started — a woven basket or mesh bag (so spores can scatter as you walk), a small knife for a clean cut at the base of the stem, and a good pair of waterproof boots for the inevitably soggy undergrowth. Move slowly and look low: chanterelles have a habit of hiding under sword fern and salal, peeking out from the duff rather than standing tall. A misty morning after a good rain, with the forest quiet and dripping, is about as pleasant a way as any to spend a fall day on the coast.",
      "Whatever you bring home, the fun continues in the kitchen. A simple sauté in butter with a little garlic and thyme is all a good chanterelle really needs, and every Step Away Lodging home has a full kitchen ready for exactly that kind of evening. Clean your finds on the deck, get them sizzling on the stove, and then take the rest of the night easy in the private hot tub while the rain taps on the trees outside.",
      "Fall is one of our favorite times to have guests on the coast — fewer crowds, moody skies, and the forest and beach both putting on a show. Browse our homes and book direct at stepawaylodging.com for your next Oregon coast escape.",
    ],
  },
];

export const postsByDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
