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
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/95 text-2xl shadow-md backdrop-blur-sm transition duration-200 hover:scale-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className={saved ? "text-brand" : "text-muted transition-colors hover:text-brand"}>
        {saved ? "♥" : "♡"}
      </span>
    </button>
  );
}
