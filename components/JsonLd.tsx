// Renders a JSON-LD <script> for structured data. Safe: data is our own,
// JSON-stringified (with `<` escaped so it can't break out of the script tag).
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
