import { notFound } from "next/navigation";
import Link from "next/link";

const dishes = [
  { id: 1, name: "Doro Wot", price: 650 },
  { id: 2, name: "Tibs", price: 500 },
  { id: 3, name: "Veg Pizza", price: 450 },
  { id: 4, name: "Beef Burger", price: 380 },
  { id: 5, name: "Cheese Burger", price: 420 },
  { id: 6, name: "Coffee", price: 70 },
  { id: 7, name: "Macchiato", price: 80 },
  { id: 8, name: "Orange Juice", price: 120 },
  { id: 9, name: "Avocado Juice", price: 120 },
];

export async function generateStaticParams() {
  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export default async function DishPage({ params }) {
  const { id } = await params;

  const dish = dishes.find((dish) => dish.id === Number(id));

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