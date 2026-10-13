"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[360px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-600"
      role="status"
      aria-live="polite"
    >
      Loading delivery map...
    </div>
  ),
});

export default function MapPanel({ courier, destination }) {
  return (
    <section aria-labelledby="delivery-map-heading" className="mt-8">
      <div className="mb-3">
        <h2
          id="delivery-map-heading"
          className="text-xl font-bold text-gray-950"
        >
          Delivery map
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Demonstration map. Marker positions are sample coordinates, not live
          courier GPS data.
        </p>
      </div>

      <DeliveryMap courier={courier} destination={destination} />

      <p className="mt-3 text-sm text-gray-600">
        Map tiles © OpenStreetMap contributors.
      </p>
    </section>
  );
}
