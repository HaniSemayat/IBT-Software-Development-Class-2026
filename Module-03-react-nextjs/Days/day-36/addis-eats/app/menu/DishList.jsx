import Link from "next/link";

export default function DishList({ dishes }) {
  return (
    <ul>
      {dishes.map((dish) => (
        <li key={dish.id}>
          <Link href={`/menu/${dish.id}`}>
            {dish.name} - {dish.price} ETB
          </Link>
        </li>
      ))}
    </ul>
  );
}