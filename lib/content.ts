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
    location: "Pacific Northwest Coast",
    headline: "A light-filled coastal retreat where the forest meets the sea.",
    description: [
      "Perched where evergreen ridgeline gives way to open ocean, Ocean Peak Ridge is a place to exhale. Wide windows pull the view inside, the deck catches the afternoon sun, and the beach is a short stroll down the path.",
      "Thoughtfully furnished and set up for easy living, the home works just as well for a quiet couple's weekend as it does for a family gathering. Cook a big dinner in the open kitchen, settle in by the fire, and fall asleep to the sound of the surf.",
    ],
    stats: { sleeps: 8, bedrooms: 3, bathrooms: 2 },
    highlights: [
      { icon: "wave", title: "Ocean views", text: "Sweeping water views from the main living space and deck." },
      { icon: "path", title: "Steps to the beach", text: "A short, easy walk down to the sand." },
      { icon: "fire", title: "Cozy & warm", text: "Fireplace, comfortable beds, and a fully stocked kitchen." },
      { icon: "paw", title: "Room for everyone", text: "Sleeps 8, with space to spread out inside and out." },
    ],
    amenities: [
      "Fast Wi-Fi",
      "Fully equipped kitchen",
      "Ocean-view deck",
      "Wood or gas fireplace",
      "Washer & dryer",
      "Free parking",
      "Smart TV / streaming",
      "Coffee & tea provided",
      "Linens & towels",
      "Outdoor seating",
      "Heating throughout",
      "Self check-in",
    ],
    area: {
      intro:
        "Set on the Pacific Northwest coast, Ocean Peak Ridge puts beaches, trails, tide pools, and small-town food and coffee all within easy reach.",
      things: [
        { title: "The beach", text: "Long walks, tide pools, and sunsets just down the path." },
        { title: "Coastal trails", text: "Forest and headland hikes with big ocean views." },
        { title: "Town & food", text: "Local seafood, coffee, bakeries, and shops nearby." },
      ],
    },
    ownerRez: {
      propertyId: "41ae2cd1cf4f432f94e601afba465119",
      widgetId: "1b6847fcb0cb4357b9e1224a43beb570",
      widgetType: "Ocean Peek Ridge Popup - Booking/Inquiry",
    },
    photos: [
      // { file: "hero.jpg", alt: "Ocean Peak Ridge living room with ocean view" },
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
