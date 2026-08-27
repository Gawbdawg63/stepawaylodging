"use client";

import { useEffect } from "react";
import { primary, ownerRezScript, type OwnerRezWidgetConfig } from "@/lib/content";

declare global {
  interface Window {
    OwnerRez?: { loadWidgets?: () => void; loadDefaultWidgets?: () => void };
  }
}

/**
 * Embeds an OwnerRez widget via OwnerRez's official loader (widget.js).
 *
 * We must use widget.js (not a hand-rolled iframe) because it owns the
 * cross-frame handshake: it auto-resizes the widget to fit its content (so the
 * inquiry/booking form isn't clipped) and, critically, handles the "redirect to
 * checkout" step by navigating the top window — which a bare iframe can't do,
 * leaving bookings stuck on "preparing…".
 *
 * widget.js only auto-scans the page for `.ownerrez-widget` divs on its own load
 * event, so on dynamic insert / client-side navigation we call its scan
 * ourselves once it's ready.
 */
function scan() {
  const or = window.OwnerRez;
  if (or?.loadDefaultWidgets) or.loadDefaultWidgets();
  else or?.loadWidgets?.();
}

export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: OwnerRezWidgetConfig;
}) {
  useEffect(() => {
    if (window.OwnerRez) {
      scan();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-orez-loader]");
    if (existing) {
      existing.addEventListener("load", scan);
      return () => existing.removeEventListener("load", scan);
    }
    const s = document.createElement("script");
    s.src = ownerRezScript;
    s.async = true;
    s.setAttribute("data-orez-loader", "");
    s.addEventListener("load", scan);
    document.body.appendChild(s);
    return () => s.removeEventListener("load", scan);
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
