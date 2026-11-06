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
  const [pageState, setPageState] = useState({ category, page: 1 });
  const page = pageState.category === category ? pageState.page : 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
      setPageState({ category, page: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [term, category]);

  const query = new URLSearchParams({
    q: debouncedTerm,
    page: String(page),
  });

  if (category !== "All") {
    query.set("category", category);
  }

  const isInitialPage =
    debouncedTerm === "" && page === 1 && category === "All";

  const { data, error, isLoading } = useSWR(
    `/api/dishes?${query.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
      fallbackData: isInitialPage ? initialData : undefined,
    }
  );

  if (error) {
    return (
      <p role="alert" className="mt-4 text-sm text-danger">
        Failed to load dishes. Please try again.
      </p>
    );
  }

  const visibleDishes = data?.dishes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="mt-6">
      <label
        htmlFor="dish-search"
        className="block text-sm font-semibold text-foreground"
      >
        Search dishes
      </label>

      <input
        id="dish-search"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for a dish..."
        className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />

      {isLoading && !data && (
        <p className="mt-4 text-sm text-muted" role="status">
          Loading dishes...
        </p>
      )}

      {data && (
        <>
          {visibleDishes.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center">
              <h2 className="text-lg font-bold text-foreground">
                No dishes found
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Try another search or choose a different category.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {debouncedTerm
                    ? "Search results"
                    : category === "All"
                      ? "All dishes"
                      : `${category} dishes`}
                </h2>

                <p className="text-sm text-muted">
                  Page {page} of {totalPages}
                </p>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDishes.map((dish, index) => (
                  <article
                    key={dish.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-foreground/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
                      <Image
                        src={dish.image}
                        alt={dish.imageAlt || dish.name}
                        fill
                        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 50vw, 33vw"
                        priority={
                          page === 1 &&
                          debouncedTerm === "" &&
                          category === "All" &&
                          index === 0
                        }
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />

                      <FavoriteButton dish={dish} />
                    </div>

                    <div className="flex h-full flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand">
                        {dish.category}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-foreground">
                        {dish.name}
                      </h3>

                      <p className="mt-3 text-lg font-bold text-brand">
                        {dish.price} ETB
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/menu/${dish.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                          View Dish
                        </Link>

                        <AddToCartButton dish={dish} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          <nav
            aria-label="Dish result pages"
            className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPageState({ category, page: page - 1 })}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-muted" aria-live="polite">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPageState({ category, page: page + 1 })}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}