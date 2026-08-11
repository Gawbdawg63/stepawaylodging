"use client";

import { useEffect, useRef, useState } from "react";
import { primary, type OwnerRezWidgetConfig } from "@/lib/content";

// A page-wide counter so each embedded widget gets a unique `seq`, which OwnerRez
// echoes back in its height messages so we can resize the right iframe.
let SEQ = 0;

/**
 * Embeds an OwnerRez widget (booking/inquiry, availability search, or reviews)
 * by rendering its hosted iframe directly — bypassing OwnerRez's widget.js
 * loader, which unreliably fails to mount widgets that are added after page load
 * or during client-side navigation (leaving a blank box).
 *
 * The hosted widget page auto-posts its content height to the parent window; we
 * listen for that message and size the iframe to fit, matching on the `seq` we
 * put in the URL so multiple widgets on one page each resize correctly.
 */
export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: OwnerRezWidgetConfig;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const seq = SEQ++;
    const params = new URLSearchParams({ seq: String(seq) });
    if (widget.propertyId) params.set("propertyKey", widget.propertyId);
    setSrc(`https://app.ownerrez.com/widgets/${widget.widgetId}?${params.toString()}`);

    function onMessage(e: MessageEvent) {
      if (typeof e.origin === "string" && !e.origin.includes("ownerrez")) return;
      let d: unknown = e.data;
      if (typeof d === "string") {
        try {
          d = JSON.parse(d);
        } catch {
          return;
        }
      }
      if (d && typeof d === "object") {
        const m = d as { height?: number; seq?: number | string };
        if (m.height && String(m.seq) === String(seq) && ref.current) {
          ref.current.style.height = Math.max(Number(m.height), 200) + "px";
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [widget.widgetId, widget.propertyId]);

  return (
    <div className="orez-embed">
      <iframe
        ref={ref}
        src={src}
        title="Step Away Lodging — OwnerRez"
        className="w-full"
        style={{ border: 0, minHeight: 620, width: "100%" }}
        scrolling="no"
      />
    </div>
  );
}
