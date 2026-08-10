"use client";

import { useEffect, useRef } from "react";
import { primary, ownerRezScript, type OwnerRezWidgetConfig } from "@/lib/content";

/**
 * Embeds an OwnerRez widget — a per-home booking/inquiry popup, or the
 * portfolio-wide availability/property search.
 *
 * OwnerRez's widget.js scans the DOM for `.ownerrez-widget` divs only when it
 * executes. On client-side navigation the script is already loaded and never
 * re-runs, leaving the new page's widget blank. So we (re-)append the loader
 * script on mount — appending a <script> element always re-executes it, which
 * makes OwnerRez re-scan and mount the widget that's currently on the page.
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
  const inited = useRef(false);

  useEffect(() => {
    // Guard against React strict-mode's double effect invocation in dev.
    if (inited.current) return;
    inited.current = true;
    const s = document.createElement("script");
    s.src = ownerRezScript;
    s.async = true;
    document.body.appendChild(s);
  }, []);

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
