
import Link from "next/link";
import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";
import { getDishes } from "../../lib/dishes";

export const metadata = {
  title: "Menu",
  description:
    "Explore Ethiopian dishes, pizzas, burgers, and drinks on the Addis Eats menu.",
  alternates: {
    canonical: "/menu",
  },
};

const categories = [
  "All",
  "Ethiopian",
  "Pizza",
  "Burgers",
  "Drinks",
];

export default async function MenuPage() {
  const dishes = await getDishes();
  const limit = 3;

  const initialData = {
    dishes: dishes.slice(0, limit),
    page: 1,
    totalPages: Math.ceil(dishes.length / limit),
  };

  return (
    <main>
      <h1>Our Menu</h1>

      <CategoryBar categories={categories} />
      <SearchBox initialData={initialData} />

      <Link href="/">Back Home</Link>
    </main>
  );
}