"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "../Providers";
import AddToCartButton from "../../components/AddToCartButton";
import FavoriteButton from "../../components/FavoriteButton";

export default function FavoritesPage() {
  const { favorites, favoritesReady } = useFavorites();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
        Addis Eats / Your collection
      </p>
      <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        Your favorites <span className="text-rose-600">♥</span>
      </h1>
      <p className="mt-3 text-gray-600">
        The dishes you love, all in one place.
      </p>

      {!favoritesReady ? (
        <p className="mt-8 text-gray-500">Loading your favorites...</p>
      ) : favorites.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-4xl text-rose-500">♡</p>
          <h2 className="mt-4 text-xl font-bold text-gray-900">No favorites yet</h2>
          <p className="mt-2 text-gray-500">Tap the heart on a dish to save it here.</p>
          <Link href="/menu" className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
            Explore the menu
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((dish) => (
            <article key={dish.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-orange-50">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt={dish.imageAlt || dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-bold text-orange-600">Addis Eats</div>
                )}
                <FavoriteButton dish={dish} />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900">{dish.name}</h2>
                <p className="mt-2 font-semibold text-orange-600">{dish.price} ETB</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/menu/${dish.id}`} className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-800 hover:bg-gray-50">
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
