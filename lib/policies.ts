// Lodging policies & FAQ, grouped for a clean accordion at /policies.
// Rebuilt from the Step Away Lodging policies page — edit any answer here.

export type Faq = { q: string; a: string };
export type FaqGroup = { title: string; items: Faq[] };

export const policyGroups: FaqGroup[] = [
  {
    title: "Booking & payment",
    items: [
      {
        q: "How do I reserve a vacation home?",
        a: "Standard reservations take a 30% deposit at booking, with the balance due 31 days before arrival. Extended stays take a 50% deposit, the remaining 50% due 90 days prior, plus a $500 security deposit.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Cancel 31+ days before arrival for a refund, less a 10% cancellation fee and a $75 reservation fee. Within 31 days, reservations are non-refundable unless we're able to re-book the dates. Extended stays cannot be cancelled once paid in full.",
      },
      {
        q: "Is there a security deposit?",
        a: "A $350 security deposit may be charged in the event of policy violations or damage to the home (extended stays carry a $500 deposit).",
      },
      {
        q: "What rates, taxes, and fees apply?",
        a: "A 12% Lincoln County / Lincoln City lodging tax and a 1.5% Oregon State tax apply, plus a cleaning fee added to each reservation.",
      },
      {
        q: "How do seasonal rates work?",
        a: "Rates follow four seasons, with holiday and summer pricing during major holidays and peak weeks.",
      },
    ],
  },
  {
    title: "Your stay",
    items: [
      { q: "What are check-in and check-out times?", a: "Check-in is 4:00 pm and check-out is 11:00 am. Early check-in or late check-out can sometimes be arranged with prior approval." },
      { q: "How will I get into the home?", a: "You'll receive an Arrival Confirmation email with entry details before your stay." },
      { q: "How does housekeeping work?", a: "Each home is cleaned before your arrival. For stays longer than 7 nights, additional cleaning can be arranged." },
      { q: "How much parking is available?", a: "Each cottage accommodates two to five vehicles — please park in the driveway." },
      { q: "What are the general house rules?", a: "No smoking and no unauthorized pets, and please keep noise to reasonable levels. We reserve the right to refuse service to anyone under 25." },
      { q: "How long should I stay?", a: "We recommend at least five days to really settle in and enjoy Lincoln City and the Oregon Coast." },
    ],
  },
  {
    title: "Homes & amenities",
    items: [
      { q: "What amenities are included?", a: "Smart TVs, high-speed internet, washer, dryer, dishwasher, linens, towels, and hot tubs. Some homes also include game areas, stereos, bikes, beach toys, and fire pits." },
      { q: "Are pets allowed?", a: "Pet-friendly homes are available — maximum of 1 dog with a 50 lb weight limit. Dogs must be leashed outdoors and can't be left unattended in the home." },
      { q: "Are there fitness centers or pools nearby?", a: "There's a seven-mile sandy shoreline for walking. Fitness 101 in Salishan is nearby, and the Lincoln City Community Center has a pool." },
    ],
  },
  {
    title: "Good to know",
    items: [
      { q: "Are there security cameras?", a: "Homes have exterior Ring cameras monitoring the driveway and entryways only. There are no cameras inside the homes or in any private areas." },
      { q: "What about construction in the area?", a: "Occasional construction may occur in the community; most is scheduled during regular business hours." },
      { q: "What are your office hours?", a: "We're here Saturday and Sunday, 365 days a year, with 24/7 assistance available during your stay." },
    ],
  },
];
