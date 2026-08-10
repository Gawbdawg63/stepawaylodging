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
  phone: "",
  email: "",
  domain: "stepawaylodging.com",
};

export const ownerRezScript = "https://app.ownerrez.com/widget.js";

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

export const properties: Property[] = [
  {
    slug: "ocean-peak-ridge",
    name: "Ocean Peak Ridge",
    location: "Olivia Beach · Lincoln City, OR",
    headline: "Three floors of coastal living with ocean views from every level — and a private hot tub.",
    blurb: "Three-level home with ocean views from every floor, a private hot tub, and multiple decks.",
    card: "homes/ocean-peak-ridge.jpg",
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
    description: [
      "A spacious four-story coastal cottage in Lincoln Beach, Oregon, Americana offers room for the whole family with hot tub access and quick, easy access to the beach.",
    ],
    stats: { sleeps: 10, bedrooms: 4, bathrooms: 2.5 },
    amenities: ["Private hot tub", "Beach access", "Fully equipped kitchen", "Room for the whole family"],
    ownerRez: {
      propertyId: "85235096f05c492f91c74bbfdeb88858",
      widgetId: "72bbd801b62846889ece089470cebb22",
      widgetType: "Americana Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/americana.jpg", alt: "Americana coastal cottage" }],
  },
  {
    slug: "americanas-paris-suite",
    name: "Americana's Paris Suite",
    location: "Lincoln Beach, OR",
    headline: "A private suite with a king bed, hot tub, and access to seven miles of Oregon beach.",
    blurb: "Romantic private suite for two with a king bed and hot tub access.",
    card: "homes/americanas-paris-suite.jpg",
    description: [
      "A private suite with a king bed and hot tub, Americana's Paris Suite offers direct access to a seven-mile stretch of Oregon beach — an intimate coastal escape for two.",
    ],
    stats: { sleeps: 2, bedrooms: 1, bathrooms: 1 },
    amenities: ["King bed", "Private hot tub", "Beach access", "Perfect for couples"],
    ownerRez: {
      propertyId: "41372be2b0504a2e89f2c223f600107c",
      widgetId: "ce203413e8c740d2b2046f15d25f0ee9",
      widgetType: "Americana's Paris Suite Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/americanas-paris-suite.jpg", alt: "Americana's Paris Suite" }],
  },
  {
    slug: "barefoot-bungalow",
    name: "Barefoot Bungalow",
    location: "Oregon Coast",
    headline: "A spacious beachside cottage with an open floor plan, hot tub, and steps to the sand.",
    blurb: "Open-plan beachside cottage with hot tub, steps from the community deck and ocean.",
    card: "homes/barefoot-bungalow.jpg",
    description: [
      "A spacious beachside cottage with an open floor plan and hot tub access, Barefoot Bungalow is just steps from the community deck and the Pacific Ocean.",
    ],
    stats: { sleeps: 8, bedrooms: 3, bathrooms: 2.5 },
    amenities: ["Private hot tub", "Open floor plan", "Steps to the beach", "Community deck"],
    ownerRez: {
      propertyId: "730b592c0d68475a892eca3315061bdd",
      widgetId: "2d8c1d9f7e9f459d93c0484173fd3e9c",
      widgetType: "Barefoot Bungalow Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/barefoot-bungalow.jpg", alt: "Barefoot Bungalow beachside cottage" }],
  },
  {
    slug: "barefoot-carriage-house",
    name: "Barefoot Carriage House",
    location: "Oregon Coast",
    headline: "A cozy private carriage house with a queen bed, hot tub, and coastline at your door.",
    blurb: "Cozy private carriage house for two with a queen bed and hot tub.",
    card: "homes/barefoot-carriage-house.jpg",
    description: [
      "A cozy private carriage house with a queen bed and hot tub, offering easy access to seven miles of Oregon coastline — a snug retreat for two.",
    ],
    stats: { sleeps: 2, bedrooms: 1, bathrooms: 1 },
    amenities: ["Queen bed", "Private hot tub", "Beach access", "Perfect for couples"],
    ownerRez: {
      propertyId: "8b0f20fc5a46444fa7dfe6bc90c3442b",
      widgetId: "2e0ad12a0e134f14aeb6a99b56751cb2",
      widgetType: "Barefoot Bungalow's Carriage House Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/barefoot-carriage-house.jpg", alt: "Barefoot Carriage House" }],
  },
  {
    slug: "beach-bungalow-by-the-sea",
    name: "Beach Bungalow…by the Sea",
    location: "Oregon Coast",
    headline: "A one-level Nantucket-style cottage with a hot tub, made for easy coastal relaxation.",
    blurb: "One-level Nantucket-style cottage with hot tub — great for couples or small families.",
    card: "homes/beach-bungalow-by-the-sea.jpg",
    description: [
      "A one-level Nantucket-style cottage with a hot tub, Beach Bungalow…by the Sea is perfect for couples or small families seeking coastal relaxation near the Pacific.",
    ],
    stats: { sleeps: 4, bedrooms: 2, bathrooms: 2 },
    amenities: ["Private hot tub", "Single-level living", "Near the Pacific", "Great for small families"],
    ownerRez: {
      propertyId: "a348008a78cc4c77b012f5e639b42b15",
      widgetId: "9d0b4815ce894c16bfdbd0dbfeac3409",
      widgetType: "Beach Bungalow By The Sea Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/beach-bungalow-by-the-sea.jpg", alt: "Beach Bungalow by the Sea cottage" }],
  },
  {
    slug: "ebb-and-flow",
    name: "Ebb and Flow",
    location: "Siletz Bay · Lincoln City, OR",
    headline: "An oceanfront cottage with a hot tub, kayaks, and direct access to Siletz Bay.",
    blurb: "Oceanfront cottage with hot tub, kayaks, and direct Siletz Bay access.",
    card: "homes/ebb-and-flow.jpg",
    description: [
      "An oceanfront cottage with a hot tub and kayaks, Ebb and Flow offers direct access to Siletz Bay — the perfect base for coastal relaxation and on-the-water adventure.",
    ],
    stats: { sleeps: 10, bedrooms: 3, bathrooms: 2 },
    amenities: ["Private hot tub", "Kayaks included", "Direct Siletz Bay access", "Oceanfront setting"],
    ownerRez: {
      propertyId: "ca2e9772b178412ba479fdb0e9a3e4d8",
      widgetId: "fdcf2a21287a4560b9be2828f44936fe",
      widgetType: "Ebb And Flow Popup - Booking/Inquiry",
    },
    photos: [{ file: "homes/ebb-and-flow.jpg", alt: "Ebb and Flow oceanfront cottage" }],
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
  heading: "Let us manage your vacation rental",
  subhead:
    "Own a coastal home? Step Away Lodging handles everything — listings, bookings, guest care, cleaning, and pricing — so your place earns more while you do less.",
  valueProps: [
    { title: "More bookings, better rates", text: "Professional listings, smart pricing, and direct bookings that keep more revenue in your pocket." },
    { title: "Truly hands-off", text: "Guest messaging, check-ins, cleaning, and maintenance are all handled — you just collect." },
    { title: "Local & hands-on", text: "We know this coast. Your home gets attentive, on-the-ground care, not a call center." },
    { title: "Full transparency", text: "Clear reporting and an owner dashboard so you always know how your home is performing." },
  ],
  // Paste a Formspree or Web3Forms endpoint URL to receive submissions by email.
  // If blank, the form opens the visitor's email app addressed to brand.email.
  formEndpoint: "https://formspree.io/f/mrpzpnew",
};
