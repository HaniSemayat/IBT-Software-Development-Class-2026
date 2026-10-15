import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";

export default function DishList({ dishes }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <article
          key={dish.id}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex h-32 items-center justify-center rounded-xl bg-orange-50">
            <span className="text-sm font-bold uppercase tracking-widest text-orange-600">
              Addis Eats
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            {dish.name}
          </h2>

          <p className="mt-2 text-lg font-semibold text-orange-600">
            {dish.price} ETB
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/menu/${dish.id}`}
              className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
            >
              View Dish
            </Link>

            <AddToCartButton dish={dish} />
          </div>
        </article>
      ))}
    </div>
  );
}
