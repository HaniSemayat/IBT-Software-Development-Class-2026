import { notFound } from "next/navigation";
import Link from "next/link";
import { getDish, getDishes } from "../../../lib/dishes";

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
    <main>
      <h1>{dish.name}</h1>
      <p>Price: {dish.price} ETB</p>

      <Link href="/menu">Back to Menu</Link>
    </main>
  );
}