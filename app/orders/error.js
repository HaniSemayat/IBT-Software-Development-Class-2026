"use client";

export default function OrdersError({ reset }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12" role="alert">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold text-brand">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          We couldn’t load your orders
        </h1>
        <p className="mt-3 leading-7 text-muted">
          Your order history could not be retrieved. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
