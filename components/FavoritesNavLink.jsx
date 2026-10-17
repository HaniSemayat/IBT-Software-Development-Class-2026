"use client";

import Link from "next/link";
import { useFavorites } from "../app/Providers";

export default function FavoritesNavLink() {
  const { favorites, favoritesReady } = useFavorites();
  const count = favorites.length;

  return (
    <Link
      href="/favorites"
      aria-label={`Favorites, ${count} saved dishes`}
      className="inline-flex items-center gap-1.5 text-gray-800 transition hover:text-orange-600"
    >
      <span aria-hidden="true" className="text-rose-600">♡</span>
      Favorites
      {favoritesReady && count > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
