// =============================================================================
// Step Away Lodging — site content
//
// Step Away Lodging is the brand/company. Each home we host is one entry in the
// `properties` array below. To add a new home later: copy an existing property
// block, give it a new `slug`, paste its OwnerRez widget IDs, drop its photos in
// /public/photos, and it's live. The homepage features the first property.
// =============================================================================

export const brand = {
  name: "Step Away Lodging",
  tagline: "Coastal escapes on the Pacific Northwest shore",
  // Logo file in /public (white version, for the dark header). Blank = show text.
  logo: "", // e.g. "logo.png"
  logoWidth: 190, // displayed width in px
  // Booking / inquiries route through OwnerRez.
  phone: "", // e.g. "(503) 555-0142" — leave blank to hide
  email: "", // e.g. "stay@stepawaylodging.com" — leave blank to hide
  domain: "stepawaylodging.com",
};

// The OwnerRez widget loader script (shared by every property's widget).
export const ownerRezScript = "https://app.ownerrez.com/widget.js";

export type Property = {
  slug: string; // URL/id, e.g. "ocean-peak-ridge"
  name: string;
  location: string;
  headline: string;
  description: string[];
  stats: { sleeps: number; bedrooms: number; bathrooms: number };
  highlights: { icon: string; title: string; text: string }[];
  amenities: string[];
  area: { intro: string; things: { title: string; text: string }[] };
  // The OwnerRez booking/inquiry widget for THIS home.
  ownerRez: { propertyId: string; widgetId: string; widgetType: string };
  // Photos: filenames in /public/photos, in display order. First = hero.
  photos: { file: string; alt: string }[];
};

export const properties: Property[] = [
  {
    slug: "ocean-peak-ridge",
    name: "Ocean Peak Ridge",
    location: "Olivia Beach · Lincoln City, Oregon",
    headline: "Three floors of coastal living with ocean views from every level — and a private hot tub.",
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
      { file: "photo-01.jpg", alt: "Open living room with vaulted ceiling and ocean-view windows" },
      { file: "photo-05.jpg", alt: "Exterior of Ocean Peak Ridge, a three-story coastal home" },
      { file: "photo-04.jpg", alt: "Kitchen island with barstools and ocean views" },
      { file: "photo-03.jpg", alt: "Private hot tub on the deck" },
      { file: "photo-12.jpg", alt: "Living room with fireplace and Smart TV" },
      { file: "photo-14.jpg", alt: "Covered ocean-view deck with dining table" },
      { file: "photo-02.jpg", alt: "Master spa bathroom with rainfall shower and soaking tub" },
      { file: "photo-16.jpg", alt: "Bedroom with ocean-view windows" },
      { file: "photo-07.jpg", alt: "Dining nook with ocean-view windows" },
      { file: "photo-09.jpg", alt: "Open-plan kitchen and living area with ocean views" },
      { file: "photo-11.jpg", alt: "Living room with sectional and ocean-view windows" },
      { file: "photo-06.jpg", alt: "Aerial view of the Olivia Beach community and coastline" },
      { file: "photo-10.jpg", alt: "Full kitchen with stainless range and stone backsplash" },
      { file: "photo-08.jpg", alt: "Kitchen and entry with ocean views" },
      { file: "photo-13.jpg", alt: "Living area with fireplace and open layout" },
      { file: "photo-15.jpg", alt: "Guest bathroom vanity" },
    ],
  },
];

// Convenience: the home featured on the homepage (for now, our only home).
export const primary = properties[0];

// -----------------------------------------------------------------------------
// Owner recruitment — the pitch to get more owners to hire Step Away Lodging
// as their property manager, plus the "list your home" lead form.
// -----------------------------------------------------------------------------
export const owners = {
  eyebrow: "For homeowners",
  heading: "Let us manage your vacation rental",
  subhead:
    "Own a coastal home? Step Away Lodging handles everything — listings, bookings, guest care, cleaning, and pricing — so your place earns more while you do less.",
  // Reasons an owner should pick you. Edit freely.
  valueProps: [
    { title: "More bookings, better rates", text: "Professional listings, smart pricing, and direct bookings that keep more revenue in your pocket." },
    { title: "Truly hands-off", text: "Guest messaging, check-ins, cleaning, and maintenance are all handled — you just collect." },
    { title: "Local & hands-on", text: "We know this coast. Your home gets attentive, on-the-ground care, not a call center." },
    { title: "Full transparency", text: "Clear reporting and an owner dashboard so you always know how your home is performing." },
  ],
  // Where "list your home" leads are sent.
  // Paste a Formspree or Web3Forms endpoint URL here to receive form submissions
  // by email (no server needed). If blank, the form falls back to opening the
  // owner's email app addressed to `brand.email`.
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
};
