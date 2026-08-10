"use client";

import { useEffect } from "react";
import { primary, ownerRezScript, type OwnerRezWidgetConfig } from "@/lib/content";

declare global {
  interface Window {
    OwnerRez?: { loadWidgets?: () => void; loadDefaultWidgets?: () => void };
  }
}

/**
 * Embeds an OwnerRez widget — a per-home booking/inquiry popup, the portfolio
 * availability search, or the reviews widget.
 *
 * The loader script (widget.js) auto-scans the page for `.ownerrez-widget` divs
 * only on its own load event. When we add it dynamically that event has often
 * already passed — and on client-side navigation the script is already loaded —
 * so the widget silently stays blank. We fix that by explicitly (re)running
 * OwnerRez's own scan once the script is ready, and immediately if it's already
 * loaded. This also handles multiple widgets sharing one loader on a page.
 */
function runScan() {
  const or = window.OwnerRez;
  if (or?.loadWidgets) or.loadWidgets();
  else or?.loadDefaultWidgets?.();
}

export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: OwnerRezWidgetConfig;
}) {
  useEffect(() => {
    if (window.OwnerRez) {
      runScan();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-orez-loader]");
    if (existing) {
      existing.addEventListener("load", runScan);
      return () => existing.removeEventListener("load", runScan);
    }
    const s = document.createElement("script");
    s.src = ownerRezScript;
    s.async = true;
    s.setAttribute("data-orez-loader", "");
    s.addEventListener("load", runScan);
    document.body.appendChild(s);
  }, [widget.widgetId]);

  return (
    <div className="orez-embed">
      <div
        className="ownerrez-widget"
        data-propertyid={widget.propertyId}
        data-widget-type={widget.widgetType}
        data-widgetid={widget.widgetId}
      />
    </div>
  );
}
