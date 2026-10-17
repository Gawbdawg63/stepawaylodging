// Reliable, no-API-key location map.
//
// Google's keyless `maps?q=<lat>,<lon>&output=embed` stopped rendering for
// coordinates (it returns a blank frame), which left every home page with an
// empty gray map box. We build an OpenStreetMap embed from the home's
// coordinates instead — it renders a real map with a pin, no key or billing.
// A place-name query (no coordinates) falls back to Google, which still works
// for text searches.

type Props = {
  query?: string; // "lat,lon" (preferred) or a place name
  title: string;
  className?: string;
  span?: number; // half-height of the view box, in degrees (default ≈ neighborhood)
  marker?: boolean; // drop a pin at the point
};

function parseLatLon(q?: string): { lat: number; lon: number } | null {
  if (!q) return null;
  const m = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  return m ? { lat: parseFloat(m[1]), lon: parseFloat(m[2]) } : null;
}

export default function LocationMap({ query, title, className, span = 0.012, marker = true }: Props) {
  const pt = parseLatLon(query);
  let src: string;
  if (pt) {
    const { lat, lon } = pt;
    // Wider than tall so the landscape frame isn't stretched.
    const bbox = [lon - span * 1.5, lat - span, lon + span * 1.5, lat + span]
      .map((n) => n.toFixed(5))
      .join("%2C");
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${
      marker ? `&marker=${lat.toFixed(5)}%2C${lon.toFixed(5)}` : ""
    }`;
  } else {
    src = `https://www.google.com/maps?q=${encodeURIComponent(query ?? "Lincoln City, Oregon")}&z=13&output=embed`;
  }
  return (
    <iframe
      title={title}
      src={src}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
