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
    <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Addis Eats
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your Cart
        </h1>
        <p className="mt-3 leading-7 text-muted">
          Review your selections before placing your order.
        </p>
      </div>

      {items.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm sm:px-10">
          <div
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-3xl"
          >
            🛒
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Your cart is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm leading-7 text-muted">
            You have not added anything delicious yet. Explore our menu and
            find something you will love.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Browse Menu
          </Link>
        </section>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {item.price} ETB per item
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Subtotal: {item.price * item.quantity} ETB
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start rounded-xl border border-border bg-background p-1 sm:self-center">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-lg font-bold text-foreground transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    −
                  </button>

                  <span
                    aria-live="polite"
                    className="min-w-8 text-center font-semibold tabular-nums text-foreground"
                  >
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-lg font-bold text-foreground transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">
                  Order total
                </p>
                <p className="mt-1 text-xs text-muted">
                  {items.reduce((count, item) => count + item.quantity, 0)}{" "}
                  {items.reduce((count, item) => count + item.quantity, 0) === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {total} ETB
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Go to Checkout
            </Link>

            <Link
              href="/menu"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Continue Shopping
            </Link>
          </section>
        </>
      )}
    </main>
  );
}