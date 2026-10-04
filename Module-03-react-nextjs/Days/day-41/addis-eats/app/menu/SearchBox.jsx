"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  const { data, error, isLoading } = useSWR(
    debouncedTerm
      ? `/api/dishes?q=${encodeURIComponent(debouncedTerm)}`
      : null,
    fetcher
  );

  return (
    <section className="mt-8">
      <label
        htmlFor="dish-search"
        className="block text-sm font-semibold"
      >
        Search dishes
      </label>

      <input
        id="dish-search"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for a dish..."
        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
      />

      {error && (
        <p className="mt-4 text-red-600">
          Failed to load dishes.
        </p>
      )}

      {isLoading && debouncedTerm && (
        <p className="mt-4 text-gray-600">
          Searching...
        </p>
      )}

      {data && (
        <div className="mt-4 space-y-2">
          {data.length === 0 ? (
            <p className="text-gray-600">
              No dishes found.
            </p>
          ) : (
            data.map((dish) => (
              <div
                key={dish.id}
                className="rounded-xl border bg-white p-4 text-gray-900"
              >
                <p className="font-semibold">{dish.name}</p>
                <p className="text-sm text-gray-600">
                  ETB {dish.price}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
