"use client";
import Link from "next/link";
import { useCart } from "../Providers";
export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Addis Eats
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your Cart
        </h1>
      </div>
      {items.length === 0 ? (
        <section className="mt-8 rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-gray-600">
            Your cart is empty.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Browse Menu
          </Link>
        </section>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-stretch justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-gray-600">
                    {item.price} ETB x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 py-2 font-bold transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 py-2 font-bold transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <section className="mt-8 rounded-2xl bg-gray-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold">
                {total} ETB
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block rounded-lg bg-orange-600 px-5 py-3 text-center font-semibold hover:bg-orange-700"
            >
              Go to Checkout
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
