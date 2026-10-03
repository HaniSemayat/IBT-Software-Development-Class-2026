import { notFound } from "next/navigation";
import Link from "next/link";
import { getDish, getDishes } from "../../../lib/dishes";
import AddToCartButton from "../../../components/AddToCartButton";

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export default async function DishPage({ params }) {
  const { id } = await params;

  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/menu"
        className="text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        ? Back to Menu
      </Link>

      <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Addis Eats
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          {dish.name}
        </h1>

        <p className="mt-4 text-2xl font-bold text-gray-900">
          {dish.price} ETB
        </p>

        <p className="mt-4 max-w-xl text-gray-600">
          Freshly prepared and ready to order from Addis Eats.
        </p>

        <div className="mt-8">
          <AddToCartButton dish={dish} />
        </div>
      </section>
    </main>
  );
}
