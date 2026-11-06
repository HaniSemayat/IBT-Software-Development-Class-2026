"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";
import { dishes } from "../../lib/dishes";

export default function MenuPage() {
  const [category, setCategory] = useState("All");
  const limit = 3;

  const initialData = {
    dishes: dishes.slice(0, limit),
    page: 1,
    totalPages: Math.ceil(dishes.length / limit),
  };

  const categories = ["All", "Ethiopian", "Pizza", "Burgers", "Drinks"];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-9">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
          Addis Eats / Made for your cravings
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Explore our menu
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          From Ethiopian favorites to quick bites and refreshing drinks,
          find something delicious for your next meal.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-border bg-surface px-4 py-2 text-muted">
            {dishes.length} dishes to explore
          </span>
          <span className="rounded-full border border-border bg-surface px-4 py-2 text-muted">
            Made for Addis Ababa
          </span>
        </div>
      </header>

      <section
        aria-label="Browse menu"
        className="rounded-2xl border border-border bg-surface p-4 sm:p-6"
      >
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
          Browse by category
        </h2>

        <CategoryBar
          categories={categories}
          selectedCategory={category}
          onSelect={setCategory}
        />

        <SearchBox initialData={initialData} category={category} />
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}