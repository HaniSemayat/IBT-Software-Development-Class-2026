"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "../Providers";
import AddToCartButton from "../../components/AddToCartButton";
import FavoriteButton from "../../components/FavoriteButton";

export default function FavoritesPage() {
  const { favorites, favoritesReady } = useFavorites();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
        Addis Eats / Your collection
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Your favorites <span className="text-rose-600">♥</span>
      </h1>

      <p className="mt-3 leading-7 text-muted">
        The dishes you love, all in one place.
      </p>

      {!favoritesReady ? (
        <p className="mt-8 text-sm text-muted">Loading your favorites...</p>
      ) : favorites.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:px-10">
          <p className="text-4xl text-rose-500">♡</p>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            No favorites yet
          </h2>

          <p className="mt-2 text-muted">
            Tap the heart on a dish to save it here.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Explore the menu
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((dish) => (
            <article
              key={dish.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-brand-soft">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt={dish.imageAlt || dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-bold text-brand">
                    Addis Eats
                  </div>
                )}

                <FavoriteButton dish={dish} />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-foreground">
                  {dish.name}
                </h2>

                <p className="mt-2 font-semibold text-brand">
                  {dish.price} ETB
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/menu/${dish.id}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-4 py-3 font-medium text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    View Dish
                  </Link>

                  <AddToCartButton dish={dish} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
