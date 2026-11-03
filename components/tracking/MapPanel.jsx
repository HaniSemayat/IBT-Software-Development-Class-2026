"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[360px] items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      Loading delivery map...
    </div>
  ),
});

export default function MapPanel({ courier, destination }) {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    setArrived(false);
    const timer = setTimeout(() => setArrived(true), 32000);
    return () => clearTimeout(timer);
  }, [courier?.lat, courier?.lng, destination?.lat, destination?.lng]);
  return (
    <section aria-labelledby="delivery-map-heading" className="mt-8">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="delivery-map-heading"
            className="text-xl font-bold text-foreground"
          >
            Delivery map
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            Live demo
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          Watch the delivery motorcycle move along the sample route. This is
          simulated movement, not real-time courier GPS tracking.
        </p>
      </div>

      <div
        className={`mb-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
          arrived
            ? "border-success/30 bg-success/10 text-success"
            : "border-brand/20 bg-brand/5 text-brand"
        }`}
        role="status"
        aria-live="polite"
      >
        {arrived
          ? "📍 Your delivery has arrived at its destination!"
          : "🛵 Your order is on its way. Follow the motorcycle on the map!"}
      </div>

      <DeliveryMap courier={courier} destination={destination} />

      <p className="mt-3 text-sm text-muted">
        Map tiles © OpenStreetMap contributors.
      </p>
    </section>
  );
}



