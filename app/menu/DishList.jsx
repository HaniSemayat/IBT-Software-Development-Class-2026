import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";

export default function DishList({ dishes }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <article
          key={dish.id}
          className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
        >
          <div className="flex h-32 items-center justify-center rounded-xl bg-brand/5 transition-colors group-hover:bg-brand/10">
            <span className="text-sm font-bold uppercase tracking-widest text-brand">
              Addis Eats
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            {dish.name}
          </h2>

          <p className="mt-2 text-lg font-semibold text-brand">
            {dish.price} ETB
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/menu/${dish.id}`}
              className="rounded-xl border border-border px-4 py-3 font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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
