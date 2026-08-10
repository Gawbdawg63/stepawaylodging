// =============================================================================
// Step Away Lodging — site content
//
// Step Away Lodging is the brand. Each home is one entry in `properties`.
// The homepage shows a grid of all homes + a portfolio availability search.
// Each home also has its own page at /homes/<slug>.
//
// To add a home: copy a property block, set a new `slug`, drop its card image
// in /public/homes/<slug>.jpg (and any gallery photos in /public/homes/<slug>/),
// paste its OwnerRez booking widget IDs, and it appears everywhere automatically.
// =============================================================================

export const brand = {
  name: "Step Away Lodging",
  tagline: "Vacation homes on the Oregon Coast",
  logo: "logo.png", // white wordmark, shown in the dark header
  logoWidth: 210,
  phone: "(541) 921-8885",
  email: "stay@stepawaylodging.com",
  domain: "stepawaylodging.com",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61582624966628",
    instagram: "https://www.instagram.com/stepawaylodging",
    pinterest: "", // add when available
  },
};

export const ownerRezScript = "https://app.ownerrez.com/widget.js";

// Brand story shown on /our-story (the owner's own copy).
export const story = {
  tagline: "Find Your Place to Unwind",
  paragraphs: [
    "Step away from the everyday and discover your place to truly relax. At Step Away Lodging, we offer thoughtfully curated vacation rentals that blend comfort, character, and the welcoming touches of home.",
    "Whether you're visiting for a coastal escape or a high-desert retreat, you'll enjoy a peaceful atmosphere, genuine hospitality, and the space to simply be. From romantic getaways and family retreats to pet-friendly cottages and group stays, each property is professionally managed and personally cared for to ensure a seamless, stress-free experience.",
    "Explore Oregon's stunning landscapes — from sandy shores to mountain trails — and feel confident knowing your stay is supported by a local team who truly cares.",
  ],
  closing: "Recharge your spirit and experience the art of staying well — your perfect Oregon stay begins here.",
  values: [
    { title: "Thoughtfully curated", text: "Homes chosen for comfort, character, and the welcoming touches of home." },
    { title: "Personally cared for", text: "Every property is professionally managed and personally looked after." },
    { title: "Coast & high desert", text: "From sandy shores to mountain trails, across Oregon's best landscapes." },
    { title: "A local team who cares", text: "Genuine hospitality and real support throughout your stay." },
  ],
};

// Portfolio-wide availability / property search widget (shown on the homepage).
export const searchWidget = {
  widgetId: "95d5ae94b0fb47c485679d98580cc919",
  widgetType: "Availability/Property Search",
};

export type OwnerRezWidgetConfig = {
  propertyId?: string; // omitted for the portfolio search widget
  widgetId: string;
  widgetType: string;
};

export type Photo = { file: string; alt: string }; // `file` is a path under /public

export type Property = {
  slug: string;
  name: string;
  location: string;
  mapQuery?: string; // town/area for the location map (not the exact address)
  headline: string;
  blurb: string; // short line for the homepage card
  card: string; // thumbnail path under /public for the homepage grid
  description: string[];
  stats: { sleeps: number; bedrooms: number; bathrooms: number };
  highlights?: { icon: string; title: string; text: string }[];
  amenities?: string[];
  area?: { intro: string; things: { title: string; text: string }[] };
  ownerRez: OwnerRezWidgetConfig;
  photos: Photo[]; // gallery for the detail page
};

// Build a gallery from numbered files in /public/homes/<slug>/ (01.jpg … NN.jpg).
function gallery(slug: string, count: number, alt: string): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    file: `homes/${slug}/${String(i + 1).padStart(2, "0")}.jpg`,
    alt,
  }));
}

export const properties: Property[] = [
  {
    slug: "ocean-peak-ridge",
    name: "Ocean Peak Ridge",
    location: "Olivia Beach · Lincoln City, OR",
    headline: "Three floors of coastal living with ocean views from every level — and a private hot tub.",
    blurb: "Three-level home with ocean views from every floor, a private hot tub, and multiple decks.",
    card: "homes/ocean-peak-ridge.jpg",
    mapQuery: "Olivia Beach, Lincoln City, OR",
    description: [
      "Perched in the charming Olivia Beach community in Lincoln City, Ocean Peak Ridge offers three floors of coastal living with beautiful west and southwest ocean views from every level. The open living area centers on a cozy fireplace and a Smart TV, and opens straight onto an ocean-view deck.",
      "The master suite is a retreat of its own — a king bed, a spa bathroom with rainfall shower and deep soaking tub, and a private ocean-view deck. Two more bedrooms, flexible sleeping in the living spaces, and a fully equipped kitchen give everyone room to spread out. Step onto the multiple decks for the ocean air, then unwind in the private hot tub as the sun goes down.",
    ],
    stats: { sleeps: 10, bedrooms: 3, bathrooms: 3.5 },
    highlights: [
      { icon: "wave", title: "Ocean views everywhere", text: "West & southwest Pacific views from all three floors and the decks." },
      { icon: "fire", title: "Hot tub & fireplace", text: "A private hot tub outside and a cozy fireplace within." },
      { icon: "path", title: "Olivia Beach community", text: "Steps from the sand in a quiet Lincoln City neighborhood, with a community pool." },
      { icon: "paw", title: "Sleeps up to 10", text: "Three bedrooms plus flexible living-space sleeping for the whole group." },
    ],
    amenities: [
      "West & southwest ocean views",
      "Private hot tub",
      "Fireplace",
      "Community pool",
      "Fully equipped kitchen",
      "Fast Wi-Fi",
      "Smart TV / streaming",
      "Outdoor grill",
      "EV charger",
      "Washer & dryer",
      "Multiple ocean-view decks",
      "Free parking",
    ],
    area: {
      intro:
        "Ocean Peak Ridge sits in Olivia Beach, a quiet planned community on the south side of Lincoln City, Oregon — steps from the sand and minutes from everything the central Oregon coast is known for.",
      things: [
        { title: "Olivia Beach", text: "Walk down to the sandy shoreline for tide pools, kite-flying, and long sunset strolls." },
        { title: "Lincoln City", text: "Restaurants, the outlet mall, Devil's Lake, and the famous glass-float finds are minutes away." },
        { title: "Explore the coast", text: "Depoe Bay whale-watching, Cascade Head trails, and Pacific City are all short drives." },
      ],
    },
    ownerRez: {
      propertyId: "41ae2cd1cf4f432f94e601afba465119",
      widgetId: "1b6847fcb0cb4357b9e1224a43beb570",
      widgetType: "Ocean Peek Ridge Popup - Booking/Inquiry",
    },
    photos: [
      { file: "photos/photo-01.jpg", alt: "Open living room with vaulted ceiling and ocean-view windows" },
      { file: "photos/photo-05.jpg", alt: "Exterior of Ocean Peak Ridge, a three-story coastal home" },
      { file: "photos/photo-04.jpg", alt: "Kitchen island with barstools and ocean views" },
      { file: "photos/photo-03.jpg", alt: "Private hot tub on the deck" },
      { file: "photos/photo-12.jpg", alt: "Living room with fireplace and Smart TV" },
      { file: "photos/photo-14.jpg", alt: "Covered ocean-view deck with dining table" },
      { file: "photos/photo-02.jpg", alt: "Master spa bathroom with rainfall shower and soaking tub" },
      { file: "photos/photo-16.jpg", alt: "Bedroom with ocean-view windows" },
      { file: "photos/photo-07.jpg", alt: "Dining nook with ocean-view windows" },
      { file: "photos/photo-09.jpg", alt: "Open-plan kitchen and living area with ocean views" },
      { file: "photos/photo-11.jpg", alt: "Living room with sectional and ocean-view windows" },
      { file: "photos/photo-06.jpg", alt: "Aerial view of the Olivia Beach community and coastline" },
      { file: "photos/photo-10.jpg", alt: "Full kitchen with stainless range and stone backsplash" },
      { file: "photos/photo-08.jpg", alt: "Kitchen and entry with ocean views" },
      { file: "photos/photo-13.jpg", alt: "Living area with fireplace and open layout" },
      { file: "photos/photo-15.jpg", alt: "Guest bathroom vanity" },
    ],
  },
  {
    slug: "americana",
    name: "Americana",
    location: "Lincoln Beach, OR",
    headline: "A spacious four-story coastal cottage with hot tub and easy beach access.",
    blurb: "Four-story family cottage with hot tub access and direct beach proximity.",
    card: "homes/americana.jpg",
    mapQuery: "Lincoln Beach, Oregon",
    description: [
      "It's never too early to start planning the perfect family vacation, and Americana is built for lifelong memories. This classic four-story beach home has southern exposure, a white-railed staircase, and an expansive front deck with seating and a swing.",
      "Inside are beach-cottage furnishings, an open layout, a fireplace, and a Smart TV. The main floor holds the living area, full kitchen, dining, and grilling deck; the second floor three bedrooms including a king master suite; and the third another queen bedroom plus a loft with games and an ocean-view deck. A private hot tub room, outdoor shower, and four beach cruisers complete it.",
    ],
    stats: { sleeps: 10, bedrooms: 4, bathrooms: 2.5 },
    amenities: ["Private hot tub", "Fireplace", "Fully equipped kitchen", "Smart TV & streaming", "Four beach cruisers", "Outdoor grill", "Washer & dryer", "Multiple ocean-view decks", "Outdoor shower", "Foosball & board games", "Fast Wi-Fi", "Garage & free parking"],
    ownerRez: {
      propertyId: "85235096f05c492f91c74bbfdeb88858",
      widgetId: "72bbd801b62846889ece089470cebb22",
      widgetType: "Americana Popup - Booking/Inquiry",
    },
    photos: gallery("americana", 12, "Americana coastal cottage"),
  },
  {
    slug: "americanas-paris-suite",
    name: "Americana's Paris Suite",
    location: "Lincoln Beach, OR",
    headline: "A private suite with a king bed, hot tub, and access to seven miles of Oregon beach.",
    blurb: "Romantic private suite for two with a king bed and hot tub access.",
    card: "homes/americanas-paris-suite.jpg",
    mapQuery: "Lincoln Beach, Oregon",
    description: [
      "A charming suite for two, Americana's Paris Suite pairs a king bed and a cozy fireplace with a kitchenette and a private deck — a warm, romantic retreat.",
      "Tucked below the main Americana home, it shares access to the serene hot tub room and outdoor shower, moments from the Oregon coastline. Booking requires the main house to be vacant.",
    ],
    stats: { sleeps: 2, bedrooms: 1, bathrooms: 1 },
    amenities: ["King bed", "Private hot tub", "Fireplace", "Kitchenette", "Private deck", "Smart TV", "Outdoor shower", "Private entrance", "Beach access", "Fast Wi-Fi", "Free parking", "Linens & towels"],
    ownerRez: {
      propertyId: "41372be2b0504a2e89f2c223f600107c",
      widgetId: "ce203413e8c740d2b2046f15d25f0ee9",
      widgetType: "Americana's Paris Suite Popup - Booking/Inquiry",
    },
    photos: gallery("americanas-paris-suite", 12, "Americana's Paris Suite"),
  },
  {
    slug: "barefoot-bungalow",
    name: "Barefoot Bungalow",
    location: "Oregon Coast",
    headline: "A spacious beachside cottage with an open floor plan, hot tub, and steps to the sand.",
    blurb: "Open-plan beachside cottage with hot tub, steps from the community deck and ocean.",
    card: "homes/barefoot-bungalow.jpg",
    mapQuery: "Bella Beach, Oregon",
    description: [
      "Be our guest at Barefoot Bungalow — a well-appointed home with an open floor plan made for families. A fully equipped kitchen, a big Smart TV with Roku, and a gas fireplace anchor the living space.",
      "The main-floor master suite has a king bed and a claw-foot soaking tub; upstairs are two more bedrooms with flexible sleeping. You're steps from the community green and a three-minute stroll to the main beach entrance, with beach toys, a grill, and a private back deck with a multi-jet hot tub.",
    ],
    stats: { sleeps: 8, bedrooms: 3, bathrooms: 2.5 },
    amenities: ["Private hot tub", "Gas fireplace", "Claw-foot soaking tub", "Fully equipped kitchen", "Smart TV with Roku", "Beach toys", "Gas grill", "Washer & dryer", "3-minute walk to the beach", "Fast Wi-Fi", "Free parking", "Linens & towels"],
    ownerRez: {
      propertyId: "730b592c0d68475a892eca3315061bdd",
      widgetId: "2d8c1d9f7e9f459d93c0484173fd3e9c",
      widgetType: "Barefoot Bungalow Popup - Booking/Inquiry",
    },
    photos: gallery("barefoot-bungalow", 12, "Barefoot Bungalow beachside cottage"),
  },
  {
    slug: "barefoot-carriage-house",
    name: "Barefoot Carriage House",
    location: "Oregon Coast",
    headline: "A cozy private carriage house with a queen bed, hot tub, and coastline at your door.",
    blurb: "Cozy private carriage house for two with a queen bed and hot tub.",
    card: "homes/barefoot-carriage-house.jpg",
    mapQuery: "Bella Beach, Oregon",
    description: [
      "Unwind in the Barefoot Carriage House, a cozy retreat for two with a queen bed, a private deck, a mini fridge, and a hot tub to soak in after a day on the sand.",
      "Set beside the main Barefoot Bungalow, it puts seven miles of Oregon coastline at your doorstep. Booking requires the main home to be vacant.",
    ],
    stats: { sleeps: 2, bedrooms: 1, bathrooms: 1 },
    amenities: ["Queen bed", "Private hot tub", "Private deck", "Mini refrigerator", "Smart TV", "Full bath with shower", "Private entrance", "Ceiling fans", "Beach access", "Fast Wi-Fi", "Free parking", "Linens & towels"],
    ownerRez: {
      propertyId: "8b0f20fc5a46444fa7dfe6bc90c3442b",
      widgetId: "2e0ad12a0e134f14aeb6a99b56751cb2",
      widgetType: "Barefoot Bungalow's Carriage House Popup - Booking/Inquiry",
    },
    photos: gallery("barefoot-carriage-house", 12, "Barefoot Carriage House"),
  },
  {
    slug: "beach-bungalow-by-the-sea",
    name: "Beach Bungalow…by the Sea",
    location: "Oregon Coast",
    headline: "A one-level Nantucket-style cottage with a hot tub, made for easy coastal relaxation.",
    blurb: "One-level Nantucket-style cottage with hot tub — great for couples or small families.",
    card: "homes/beach-bungalow-by-the-sea.jpg",
    mapQuery: "Bella Beach, Oregon",
    description: [
      "Just a few homes back from the Pacific on Bella Beach's main street, Beach Bungalow…by the Sea is a single-level, Nantucket-style cottage with everything you need for couples or a small family. Elevated wood ceilings, a gas fireplace, and custom furnishings give the open living room real warmth.",
      "The master suite has a queen bed with glass doors to the deck; the second bedroom a king. Both open to a large back deck with a hot tub. The kitchen has granite counters and stainless appliances, and the 450-square-foot rear deck faces south amid native coastal plantings.",
    ],
    stats: { sleeps: 4, bedrooms: 2, bathrooms: 2 },
    amenities: ["Private hot tub", "Gas fireplace", "Single-level living", "Granite & stainless kitchen", "Smart TV with Roku", "Outdoor grill", "Washer & dryer", "Outdoor shower", "Steps to the Pacific", "Fast Wi-Fi", "Free parking", "Linens & towels"],
    ownerRez: {
      propertyId: "a348008a78cc4c77b012f5e639b42b15",
      widgetId: "9d0b4815ce894c16bfdbd0dbfeac3409",
      widgetType: "Beach Bungalow By The Sea Popup - Booking/Inquiry",
    },
    photos: gallery("beach-bungalow-by-the-sea", 12, "Beach Bungalow by the Sea cottage"),
  },
  {
    slug: "ebb-and-flow",
    name: "Ebb and Flow",
    location: "Siletz Bay · Lincoln City, OR",
    headline: "An oceanfront cottage with a hot tub, kayaks, and direct access to Siletz Bay.",
    blurb: "Oceanfront cottage with hot tub, kayaks, and direct Siletz Bay access.",
    card: "homes/ebb-and-flow.jpg",
    mapQuery: "Siletz Bay, Lincoln City, OR",
    description: [
      "Clean, simple, private, and romantic — Ebb and Flow is everything you want in a coastal cottage. The main level opens up with a kitchen, dining, and family room in hardwood floors and sweeping Siletz Bay views; upstairs is a king master suite with a private bath and a daybed.",
      "Right on the bay in Lincoln City, it comes with beach access, crab traps (with instructions), beach bikes, and a garage with a ping-pong table — minutes from restaurants, golf, Chinook Winds, and the outlet stores. Hunt glass floats, kayak, clam, and build beach fires from your doorstep.",
    ],
    stats: { sleeps: 10, bedrooms: 3, bathrooms: 2 },
    amenities: ["Oceanfront on Siletz Bay", "Private hot tub", "Fireplace", "Full kitchen", "Kayaks & crab traps", "Beach bikes", "Ping-pong table", "Smart TV with Roku", "Washer & dryer", "Outdoor grill", "Pet-friendly", "Garage & free parking"],
    ownerRez: {
      propertyId: "ca2e9772b178412ba479fdb0e9a3e4d8",
      widgetId: "fdcf2a21287a4560b9be2828f44936fe",
      widgetType: "Ebb And Flow Popup - Booking/Inquiry",
    },
    photos: gallery("ebb-and-flow", 12, "Ebb and Flow oceanfront cottage"),
  },
];

export const primary = properties[0];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

// OwnerRez "combo" listings — book two adjoining units together. Surfaced by the
// portfolio search widget; kept here for optional per-home cross-links later.
export const combos: OwnerRezWidgetConfig[] = [
  { propertyId: "a671bd1ffe5340938b4098d418160074", widgetId: "18df19e07dea4d69a9025c3bb504e515", widgetType: "Americana & Paris Suite Popup - Booking/Inquiry" },
  { propertyId: "2e1729c20ef543569caf23753f1d69e5", widgetId: "aca3cfd938ba418ea10894696ed94ad8", widgetType: "Barefoot Bungalow & Carriage House Popup - Booking/Inquiry" },
];

// -----------------------------------------------------------------------------
// Central Oregon expansion — announce the move inland and invite owners to apply.
// -----------------------------------------------------------------------------
export const centralOregon = {
  eyebrow: "Now expanding",
  heading: "Step Away Lodging is coming to Central Oregon",
  body: "We're bringing our hands-on, local hospitality inland — to the high desert, the Cascades, and the towns in between. The same attentive care and book-direct advantage our coastal owners rely on is heading east.",
  places: ["Bend", "Sunriver", "Redmond", "Sisters", "La Pine"],
  ownerLine: "Have a home in Central Oregon?",
  ctaLabel: "Apply to have us manage it",
};

// -----------------------------------------------------------------------------
// Owner recruitment — the pitch to get more owners to hire Step Away Lodging
// as their property manager, plus the "list your home" lead form.
// -----------------------------------------------------------------------------
export const owners = {
  eyebrow: "For homeowners",
  heading: "Property management that feels personal",
  subhead:
    "With 30 years in the short-term rental industry, Step Away Lodging helps homeowners turn their vacation or investment properties into rewarding, stress-free rentals. Our personalized, full-service boutique management keeps your home cared for, your guests delighted, and your financial goals on track.",
  valueProps: [
    { title: "30 years of experience", text: "We know the short-term rental business inside and out." },
    { title: "Full-service & boutique", text: "Personalized management — listings, guest care, cleaning, and pricing, all handled." },
    { title: "Family owned & operated", text: "A local team that treats your home like our own." },
    { title: "Seamless & profitable", text: "Your property cared for, your guests delighted, and your financial goals achieved." },
  ],
  // Paste a Formspree or Web3Forms endpoint URL to receive submissions by email.
  // If blank, the form opens the visitor's email app addressed to brand.email.
  formEndpoint: "https://formspree.io/f/mrpzpnew",
};
