// =============================================================================
// Ocean Peak Ridge — site content
// Edit everything about the property here. Text, numbers, amenities, photos.
// (Photos: drop image files in /public/photos and list the filenames below.)
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

export const property = {
  name: "Ocean Peak Ridge",
  location: "Pacific Northwest Coast",
  // One-line hook shown under the hero title.
  headline: "A light-filled coastal retreat where the forest meets the sea.",
  // The main description paragraph(s). Replace with your real listing copy.
  description: [
    "Perched where evergreen ridgeline gives way to open ocean, Ocean Peak Ridge is a place to exhale. Wide windows pull the view inside, the deck catches the afternoon sun, and the beach is a short stroll down the path.",
    "Thoughtfully furnished and set up for easy living, the home works just as well for a quiet couple's weekend as it does for a family gathering. Cook a big dinner in the open kitchen, settle in by the fire, and fall asleep to the sound of the surf.",
  ],
  // Headline stats shown in the hero and highlights.
  stats: {
    sleeps: 8,
    bedrooms: 3,
    bathrooms: 2,
  },
  // Short highlight bullets (3–6 works best).
  highlights: [
    { icon: "wave", title: "Ocean views", text: "Sweeping water views from the main living space and deck." },
    { icon: "path", title: "Steps to the beach", text: "A short, easy walk down to the sand." },
    { icon: "fire", title: "Cozy & warm", text: "Fireplace, comfortable beds, and a fully stocked kitchen." },
    { icon: "paw", title: "Room for everyone", text: `Sleeps ${8}, with space to spread out inside and out.` },
  ],
  // Amenities grid. Add/remove freely.
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
  // The area / things to do.
  area: {
    intro:
      "Set on the Pacific Northwest coast, Ocean Peak Ridge puts beaches, trails, tide pools, and small-town food and coffee all within easy reach.",
    things: [
      { title: "The beach", text: "Long walks, tide pools, and sunsets just down the path." },
      { title: "Coastal trails", text: "Forest and headland hikes with big ocean views." },
      { title: "Town & food", text: "Local seafood, coffee, bakeries, and shops nearby." },
    ],
  },
};

// OwnerRez booking/inquiry widget for Ocean Peak Ridge.
// This is the exact embed OwnerRez generated — bookings & payments run through it.
export const ownerRez = {
  propertyId: "41ae2cd1cf4f432f94e601afba465119",
  widgetId: "1b6847fcb0cb4357b9e1224a43beb570",
  widgetType: "Ocean Peek Ridge Popup - Booking/Inquiry",
  scriptSrc: "https://app.ownerrez.com/widget.js",
};

// Photos. Put files in /public/photos and list the filenames here in order.
// The first photo becomes the hero. Leave the array empty to show placeholders.
export const photos: { file: string; alt: string }[] = [
  // { file: "hero.jpg", alt: "Ocean Peak Ridge living room with ocean view" },
  // { file: "deck.jpg", alt: "Deck overlooking the water" },
];
