"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";
import AddToCartButton from "../../components/AddToCartButton";
import FavoriteButton from "../../components/FavoriteButton";

export default function SearchBox({ initialData, category = "All" }) {
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

  useEffect(() => {
    setPage(1);
  }, [category]);

  const query = new URLSearchParams({
    q: debouncedTerm,
    page: String(page),
  });

  if (category !== "All") query.set("category", category);

  const isInitialPage = debouncedTerm === "" && page === 1 && category === "All";

  const { data, error, isLoading } = useSWR(
    `/api/dishes?${query.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
      fallbackData: isInitialPage ? initialData : undefined,
    }
  );

  if (error) {
    return <p role="alert" className="mt-4 text-red-600">Failed to load dishes.</p>;
  }

  const dishes = data?.dishes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="mt-6">
      <label htmlFor="dish-search" className="block text-sm font-semibold text-gray-800">
        Search dishes
      </label>
      <input
        id="dish-search"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for a dish..."
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {isLoading && !data && <p className="mt-4 text-gray-600">Loading dishes...</p>}

      {data && (
        <>
          {dishes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="font-semibold text-gray-800">No dishes found</p>
              <p className="mt-1 text-sm text-gray-500">Try another search or category.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish, index) => (
                <article key={dish.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
                    <Image
                      src={dish.image}
                      alt={dish.imageAlt || dish.name}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw"
                      priority={page === 1 && debouncedTerm === "" && category === "All" && index === 0}
                      className="object-cover"
                    />
                    <FavoriteButton dish={dish} />
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900">{dish.name}</h2>
                    <p className="mt-2 text-lg font-semibold text-orange-600">{dish.price} ETB</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link href={`/menu/${dish.id}`} className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-50">
                        View Dish
                      </Link>
                      <AddToCartButton dish={dish} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
