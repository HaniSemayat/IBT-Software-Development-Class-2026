"use client";

import useSWR from "swr";
import fetcher from "../../../lib/fetcher";

export default function OrderStatus({ id, initial }) {
  const { data, error, isLoading } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData: initial,
      refreshInterval: 5000,
    }
  );

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load order.
      </p>
    );
  }

  if (isLoading && !data) {
    return <p>Loading order...</p>;
  }

  return (
    <section className="mt-8 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm">
      <p>
        <strong>Name:</strong> {data.name}
      </p>

      <p className="mt-2">
        <strong>Phone:</strong> {data.phone}
      </p>

      <p className="mt-2">
        <strong>Delivery Area:</strong> {data.area}
      </p>

      <p className="mt-2">
        <strong>Status:</strong> {data.status}
      </p>
    </section>
  );
}
