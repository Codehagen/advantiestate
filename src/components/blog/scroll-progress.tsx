"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      setProgress(Math.min(100, Math.max(0, scrolled * 100)));
    };

    // Throttle to one update per animation frame — a raw scroll handler fires
    // many times per frame and would re-render the bar on each. The listener is
    // passive so it never blocks scrolling. See PERFORMANCE_PLAN.md Phase 5.1.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute(); // initial calculation

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-warm-grey-2/10">
      <div
        className="h-full bg-warm-grey-2/60 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
