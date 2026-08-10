"use client";

import { useEffect } from "react";
import { primary, ownerRezScript, type OwnerRezWidgetConfig } from "@/lib/content";

declare global {
  interface Window {
    OwnerRez?: { loadWidgets?: () => void; loadDefaultWidgets?: () => void };
  }
}

/**
 * Embeds an OwnerRez widget — a per-home booking/inquiry popup, or the
 * portfolio-wide availability/property search.
 *
 * The loader script is added once. On later mounts (client-side navigation) the
 * script is already present, so we call OwnerRez's own `loadWidgets()` to scan
 * and mount the widget currently on the page — otherwise it would stay blank.
 *
 * Attribute names are lowercase on purpose: browsers lowercase data-* anyway,
 * and that's the form OwnerRez reads. `data-propertyid` is omitted for the
 * search widget (it has no propertyId).
 */
export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: OwnerRezWidgetConfig;
}) {
  useEffect(() => {
    if (window.OwnerRez?.loadWidgets) {
      window.OwnerRez.loadWidgets();
      return;
    }
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
