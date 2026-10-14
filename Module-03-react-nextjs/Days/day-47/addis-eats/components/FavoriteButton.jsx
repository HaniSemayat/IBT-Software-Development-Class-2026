"use client";

import { useFavorites } from "../app/Providers";

export default function FavoriteButton({ dish }) {
  const { isFavorite, toggleFavorite, favoritesReady } = useFavorites();
  const saved = isFavorite(dish.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(dish)}
      disabled={!favoritesReady}
      aria-label={saved ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
      aria-pressed={saved}
      title={saved ? "Remove from favorites" : "Add to favorites"}
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md transition hover:scale-110 disabled:opacity-60"
    >
      <span className={saved ? "text-rose-600" : "text-gray-500"}>
        {saved ? "♥" : "♡"}
      </span>
    </button>
  );
}
