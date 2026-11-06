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
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      Favorites
      {favoritesReady && count > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-xs font-bold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
