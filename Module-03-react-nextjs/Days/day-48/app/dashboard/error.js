"use client";

export default function DashboardError({ reset }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12" role="alert">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold text-brand">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          Analytics dashboard unavailable
        </h1>
        <p className="mt-3 text-muted">
          We couldn’t load the order and revenue summaries. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 cursor-pointer rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
