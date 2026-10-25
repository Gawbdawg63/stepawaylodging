"use client";

// Modern, interactive location map — no API key, no billing.
//
// Google's keyless coordinate embed renders blank, and OpenStreetMap's own embed
// only offers the dated "mapnik" style. We render a real Leaflet map with CARTO's
// Voyager basemap (a clean, modern, Google-like style) and a brand-colored pin.
// Leaflet is loaded once from a CDN so it stays out of the main bundle.
//
// A place-name query (no coordinates) falls back to Google's text-search embed,
// which still works without a key.

import { useEffect, useRef } from "react";

type Props = {
  query?: string; // "lat,lon" (preferred) or a place name
  title: string;
  className?: string;
  zoom?: number; // default ≈ neighborhood
  marker?: boolean; // drop a pin at the point
};

function parseLatLon(q?: string): { lat: number; lon: number } | null {
  if (!q) return null;
  const m = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  return m ? { lat: parseFloat(m[1]), lon: parseFloat(m[2]) } : null;
}

const LEAFLET_VERSION = "1.9.4";
let leafletReady: Promise<void> | null = null;

// Load Leaflet's CSS + JS from the CDN a single time, shared across every map.
function loadLeaflet(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { L?: unknown }).L) return Promise.resolve();
  if (leafletReady) return leafletReady;

  leafletReady = new Promise<void>((resolve, reject) => {
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.min.css`;
      link.setAttribute("data-leaflet", "");
      document.head.appendChild(link);
    }
    const existing = document.querySelector("script[data-leaflet]") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("leaflet failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.min.js`;
    s.async = true;
    s.setAttribute("data-leaflet", "");
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("leaflet failed"));
    document.head.appendChild(s);
  });
  return leafletReady;
}

// A clean teardrop pin in the brand's sand color.
const PIN_HTML =
  '<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13.3 25.4 13.9 26a1.5 1.5 0 0 0 2.2 0C16.7 40.4 30 25.5 30 15 30 6.7 23.3 0 15 0z" fill="#C8A26B"/>' +
  '<circle cx="15" cy="15" r="6" fill="#fff"/></svg>';

export default function LocationMap({ query, title, className, zoom = 15, marker = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pt = parseLatLon(query);
    if (!pt) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    loadLeaflet()
      .then(() => {
        const el = ref.current;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L;
        if (cancelled || !el || !L) return;
        // Guard against a double init (React strict mode / fast refresh).
        if ((el as unknown as { _leaflet_id?: number })._leaflet_id) return;

        map = L.map(el, { scrollWheelZoom: false }).setView([pt.lat, pt.lon], zoom);
        // Esri's free, no-key basemaps: crisp satellite imagery with a light
        // labels/roads overlay — a modern, Google-like hybrid view.
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics", maxZoom: 19 }
        ).addTo(map);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Labels &copy; Esri", maxZoom: 19, pane: "overlayPane" }
        ).addTo(map);

        if (marker) {
          const icon = L.divIcon({
            className: "",
            html: PIN_HTML,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
          });
          L.marker([pt.lat, pt.lon], { icon, keyboard: false }).addTo(map);
        }
        // Tiles can mis-measure if the container sized after init.
        setTimeout(() => map && map.invalidateSize(), 0);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [query, zoom, marker]);

  const pt = parseLatLon(query);
  if (!pt) {
    const src = `https://www.google.com/maps?q=${encodeURIComponent(query ?? "Lincoln City, Oregon")}&z=13&output=embed`;
    return <iframe title={title} src={src} className={className} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
  }

  return <div ref={ref} className={className} role="img" aria-label={title} />;
}
