// The 5-touch owner-recruitment email sequence. `waitDays` is how long to wait
// after the previous email before sending this one (the first is 0 = send when
// the lead becomes due). Merge fields: {{first_name}}, {{city}}, {{property}}.
//
// Written for cold B2B lead-gen: short, human, one easy ask each, curiosity-
// driven subjects, a new angle per follow-up, and a soft breakup at the end.
export type SequenceStep = { waitDays: number; subject: string; body: string };

export const SEQUENCE: SequenceStep[] = [
  {
    waitDays: 0,
    subject: "your {{city}} rental",
    body: `Hi {{first_name}},

I'm Maxwell with Step Away Lodging, a family-run vacation rental manager here on the Oregon Coast. I came across your rental in {{city}} and wanted to reach out.

We handle the whole grind for owners: bookings, guest messages, cleaning, and pricing. We keep homes booked with five-star reviews, and most owners come to us simply worn out from doing it all themselves.

Would you be open to a quick call to see if we'd be a good fit? Even a "not right now" is a perfectly fine reply.

Maxwell Ward
Step Away Lodging
541-961-4703 · stepawaylodging.com`,
  },
  {
    waitDays: 3,
    subject: "re: your {{city}} rental",
    body: `Hi {{first_name}},

Floating this back to the top in case it slipped by. The short version: we're a local family, not a call center. You get one team that treats your home like our own, and guests who leave reviews to match.

Worth a quick call? Happy to answer anything.

Maxwell
541-961-4703`,
  },
  {
    waitDays: 4,
    subject: "the part owners actually hate",
    body: `Hi {{first_name}},

The thing owners tell us they dread most isn't the cleaning. It's the 9pm "the hot tub won't heat" texts and constantly tweaking prices to stay booked. We take all of it, and keep you in the loop with clear, honest reporting.

Want me to put together a quick, free estimate of what your {{city}} place could earn with us? No strings.

Maxwell Ward
541-961-4703`,
  },
  {
    waitDays: 5,
    subject: "a free number for your place",
    body: `Hi {{first_name}},

No pressure at all. But if you're even a little curious, I'll put together a free estimate of what your rental could bring in with full-service local management.

Just reply "yes" and I'll send it over.

Maxwell
541-961-4703`,
  },
  {
    waitDays: 6,
    subject: "should I close your file?",
    body: `Hi {{first_name}},

I don't want to clutter your inbox, so this is my last note for now. If managing the rental ever starts feeling like more than it's worth, we're right here on the coast and glad to help.

Wishing you great guests either way.

Maxwell Ward
Step Away Lodging
541-961-4703 · stepawaylodging.com`,
  },
];
