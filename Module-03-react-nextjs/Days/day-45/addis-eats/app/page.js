import Link from "next/link";

export const metadata = {
  title: "Home",
  description:
    "Discover Ethiopian favorites, pizzas, burgers, and drinks with Addis Eats food delivery.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-3xl bg-orange-50 px-8 py-16 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
          Addis Ababa
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900">
          Welcome to Addis Eats
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Discover delicious food from Addis Eats and order your favorites with ease.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/menu"
            className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Explore Menu
          </Link>

          <Link
            href="/cart"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            View Cart
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Fresh Food</h2>
          <p className="mt-2 text-gray-600">
            Explore a selection of Ethiopian favorites, pizzas, burgers, and drinks.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Easy Ordering</h2>
          <p className="mt-2 text-gray-600">
            Choose a dish, add it to your cart, and continue to checkout.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Built with Next.js</h2>
          <p className="mt-2 text-gray-600">
            A server-first food ordering project built with Next.js and React.
          </p>
        </div>
      </section>
    </main>
  );
}
