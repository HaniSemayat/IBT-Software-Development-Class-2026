
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-16 sm:px-8">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-4xl"
        >
          🔎
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Addis Eats
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dish not found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-muted">
          Looks like this dish is not on our menu. It may have been removed,
          or the link might be incorrect. Do not worry — there is plenty more
          delicious food to explore.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Explore the Menu
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted">
          Good food is never too far away.
        </p>
      </section>
    </main>
  );
}
