
import Link from "next/link";

export const metadata = {
  title: "Home",
  description:
    "Discover Ethiopian favorites, pizzas, burgers, and drinks with Addis Eats food delivery.",
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    number: "01",
    title: "Fresh Food",
    description:
      "Explore Ethiopian favorites, pizzas, burgers, and refreshing drinks.",
  },
  {
    number: "02",
    title: "Easy Ordering",
    description:
      "Choose your favorite dishes, build your cart, and order with ease.",
  },
  {
    number: "03",
    title: "Made for Addis",
    description:
      "A convenient food-ordering experience designed around Addis Ababa.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl bg-brand-soft px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-white/40"
        />

        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Made for Addis Ababa
          </p>

          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Good food.
            <br />
            Great mood.
            <br />
            <span className="text-brand">Delivered with care.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            From Ethiopian favorites to burgers and pizza, discover
            something delicious and make your next meal special.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Explore the menu
            </Link>

            <Link
              href="/cart"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-7 py-3 font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View your cart
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted">
            Discover your next favorite, one dish at a time.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Why Addis Eats
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your next meal starts here.
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex min-h-11 items-center font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            Browse all dishes
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-sm font-bold text-brand">
                {feature.number}
              </span>

              <h3 className="mt-5 text-xl font-bold text-foreground">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-5 rounded-2xl bg-foreground px-6 py-9 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="text-2xl font-bold">Hungry already?</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Find something you love and get your order started.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:bg-brand-soft"
        >
          Find your food
        </Link>
      </section>
    </main>
  );
}
