"use client";

// Modern vector location map — the same clean "light" basemap (soft land,
// teal water) used on Beachcombers NW. MapLibre GL renders Protomaps vector
// tiles from a hosted PMTiles archive; no API key, no billing.
//
// If the browser can't run WebGL, we fall back to a plain Google Maps link so
// the page never loses its location entirely.

import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import layers from "protomaps-themes-base";
import { useEffect, useRef, useState } from "react";

// Public PMTiles archive covering the Pacific-NW coast (Oregon + Washington).
const PMTILES_URL =
  process.env.NEXT_PUBLIC_PMTILES_URL ||
  "https://bzxvonlaxssnhnpursxo.supabase.co/storage/v1/object/public/assets/maps/pnw-coast-v2.pmtiles";

let protocolRegistered = false;
function ensureProtocol() {
  if (protocolRegistered || typeof window === "undefined") return;
  maplibregl.addProtocol("pmtiles", new Protocol().tile);
  protocolRegistered = true;
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function parseLatLon(q?: string): { lat: number; lon: number } | null {
  if (!q) return null;
  const m = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  return m ? { lat: parseFloat(m[1]), lon: parseFloat(m[2]) } : null;
}

// A clean teardrop pin in the brand's sand color.
const PIN_HTML =
  '<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13.3 25.4 13.9 26a1.5 1.5 0 0 0 2.2 0C16.7 40.4 30 25.5 30 15 30 6.7 23.3 0 15 0z" fill="#C8A26B"/>' +
  '<circle cx="15" cy="15" r="6" fill="#fff"/></svg>';

type Props = {
  query?: string; // "lat,lon" (preferred) or a place name
  title: string;
  className?: string;
  zoom?: number;
  marker?: boolean;
};

export default function LocationMap({ query, title, className, zoom = 12, marker = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const pt = parseLatLon(query);

  useEffect(() => {
    if (!ref.current || !pt) return;
    if (!webglAvailable()) {
      setUnavailable(true);
      return;
    }
    ensureProtocol();

    const style: maplibregl.StyleSpecification = {
      version: 8,
      glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
      sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
      sources: {
        protomaps: {
          type: "vector",
          url: `pmtiles://${PMTILES_URL}`,
          attribution:
            '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
        },
      },
      layers: layers("protomaps", "light", "en"),
    };

    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: ref.current,
        style,
        center: [pt.lon, pt.lat],
        zoom,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
    } catch {
      setUnavailable(true);
      return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    let pin: maplibregl.Marker | undefined;
    if (marker) {
      const el = document.createElement("div");
      el.innerHTML = PIN_HTML;
      pin = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([pt.lon, pt.lat]).addTo(map);
    }

    return () => {
      pin?.remove();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, zoom, marker]);

  if (!pt) {
    const src = `https://www.google.com/maps?q=${encodeURIComponent(query ?? "Lincoln City, Oregon")}&z=13&output=embed`;
    return <iframe title={title} src={src} className={className} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
  }

  if (unavailable) {
    return (
      <div className={`flex items-center justify-center bg-[var(--border)]/40 p-6 text-center text-sm text-[var(--muted)] ${className ?? ""}`}>
        <span>
          Interactive map needs graphics acceleration.{" "}
          <a
            className="font-medium text-[var(--sand-600)] underline underline-offset-2"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query ?? "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
          .
        </span>
      </div>
    );
  }

  return <div ref={ref} className={className} role="img" aria-label={title} />;
}
