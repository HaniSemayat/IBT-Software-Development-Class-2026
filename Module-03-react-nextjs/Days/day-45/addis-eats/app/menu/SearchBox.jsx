"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

export default function SearchBox({ initialData }) {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  const isInitialPage = debouncedTerm === "" && page === 1;

  const { data, error, isLoading } = useSWR(
    `/api/dishes?q=${encodeURIComponent(debouncedTerm)}&page=${page}`,
    fetcher,
    {
      keepPreviousData: true,
      fallbackData: isInitialPage ? initialData : undefined,
    }
  );

  if (error) {
    return (
      <p className="mt-4 text-red-600">
        Failed to load dishes.
      </p>
    );
  }

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

      {isLoading && !data && (
        <p className="mt-4 text-gray-600">
          Loading...
        </p>
      )}

      {data && (
        <>
          {data.dishes.length === 0 ? (
            <p className="mt-6 text-gray-600">
              No dishes found.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.dishes.map((dish, index) => (
                <article
                  key={dish.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-orange-50">
                    <Image
                      src={dish.image}
                      alt={dish.imageAlt}
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(50vw - 3rem), 33vw"
                      fetchPriority={
                        page === 1 && debouncedTerm === "" && index === 0
                          ? "high"
                          : "auto"
                      }
                      loading={
                        page === 1 && debouncedTerm === "" && index === 0
                          ? "eager"
                          : "lazy"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-900">
                    {dish.name}
                  </h2>

                  <p className="mt-2 text-lg font-semibold text-orange-600">
                    {dish.price} ETB
                  </p>

                  <Link
                    href={`/menu/${dish.id}`}
                    className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800"
                  >
                    View Dish
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {page} of {data.totalPages}
            </span>

            <button
              disabled={page === data.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
