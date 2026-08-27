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
    // If widget.js is already loaded (e.g. client-side navigation between pages),
    // it won't auto-scan again — so we ask it to mount this page's widget.
    if (window.OwnerRez) {
      scan();
      return;
    }
    // First load: just add the loader. widget.js auto-initializes every
    // `.ownerrez-widget` on the page when it loads — no manual scan needed
    // (calling it again would double-init and trigger a phantom validation error).
    if (!document.querySelector("script[data-orez-loader]")) {
      const s = document.createElement("script");
      s.src = ownerRezScript;
      s.async = true;
      s.setAttribute("data-orez-loader", "");
      document.body.appendChild(s);
    }
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
