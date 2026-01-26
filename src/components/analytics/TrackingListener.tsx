"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

function getLinkUrl(el: Element): string {
  const a = el.closest("a");
  return (a?.getAttribute("href") ?? "") || "";
}

export function TrackingListener() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const tracked = target.closest<HTMLElement>("[data-track]");
      if (!tracked) return;

      const ctaId = tracked.getAttribute("data-track") ?? "";
      if (!ctaId) return;

      const linkUrl = getLinkUrl(tracked);
      const pagePath = typeof window !== "undefined" ? window.location.pathname : "";

      trackEvent("cta_clicked", {
        cta_id: ctaId,
        page_path: pagePath,
        link_url: linkUrl,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
