// The 5-touch owner-recruitment email sequence. `waitDays` is how long to wait
// after the previous email before sending this one (the first is 0 = send when
// the lead becomes due). Merge fields: {{first_name}}, {{city}}, {{property}}.
export type SequenceStep = { waitDays: number; subject: string; body: string };

export const SEQUENCE: SequenceStep[] = [
  {
    waitDays: 0,
    subject: "Managing your {{city}} rental?",
    body: `Hi {{first_name}},

I'm Maxwell with Step Away Lodging — a family-owned property management company here on the Oregon Coast. I came across your short-term rental in {{city}} and wanted to reach out.

We handle everything for owners like you: listings, guest communication, cleaning and turnovers, dynamic pricing, and maintenance — so your place earns well without eating up your time. After 30+ years on this coast, we know exactly what turns a rental into a five-star stay.

Would you be open to a quick call to see if we'd be a good fit? Even if you're happy where you are, I'm glad to share a free, no-obligation look at what your home could be earning.

Warmly,
Maxwell Ward
Step Away Lodging
541-961-4703 · stepawaylodging.com`,
  },
  {
    waitDays: 3,
    subject: "Re: Managing your {{city}} rental?",
    body: `Hi {{first_name}},

Just floating this back to the top of your inbox. What makes us different from the big management companies: we're a local family, not a call center. You get one team that treats your home like our own — and guests who leave reviews to match.

Happy to answer any questions.

Maxwell Ward
Step Away Lodging
541-961-4703`,
  },
  {
    waitDays: 4,
    subject: "A local team for your {{city}} rental",
    body: `Hi {{first_name}},

A lot of owners come to us tired of juggling cleaners, messages, and pricing themselves — or frustrated with a manager who's gone quiet. We take all of it off your plate and keep you in the loop with clear, honest reporting.

If you've ever thought "there has to be an easier way," this is it. Want me to put together a quick estimate for your place?

Maxwell Ward
Step Away Lodging
541-961-4703`,
  },
  {
    waitDays: 5,
    subject: "A free rental assessment for your home",
    body: `Hi {{first_name}},

No pressure at all — but if you're even a little curious what your rental could earn with full-service local management, I'll put together a free assessment for your property.

Just reply "yes" and I'll take it from there.

Maxwell Ward
Step Away Lodging
541-961-4703`,
  },
  {
    waitDays: 6,
    subject: "Should I close your file?",
    body: `Hi {{first_name}},

I don't want to crowd your inbox, so this is my last note for now. If managing your rental ever starts feeling like too much, we're right here on the coast and happy to help.

Wishing you great guests either way.

Maxwell Ward
Step Away Lodging
541-961-4703 · stepawaylodging.com`,
  },
];
