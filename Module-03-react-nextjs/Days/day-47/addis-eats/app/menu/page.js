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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
          Addis Eats / Made for your cravings
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Explore our menu
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          From Ethiopian favorites to quick bites and refreshing drinks, find your next favorite.
        </p>
      </header>

      <CategoryBar
        categories={categories}
        selectedCategory={category}
        onSelect={setCategory}
      />

      <SearchBox initialData={initialData} category={category} />

      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-orange-700 hover:text-orange-800">
          &larr; Back home
        </Link>
      </div>
    </main>
  );
}
