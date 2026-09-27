import { Suspense } from "react";
import Link from "next/link";
import DishList from "./DishList";
import CategoryBar from "./CategoryBar";
import FilterShell from "./FilterShell";
import { getDishes } from "../../lib/dishes";

export const revalidate = 3600;

const categories = [
  "All",
  "Ethiopian",
  "Pizza",
  "Burgers",
  "Drinks",
];


export default async function MenuPage() {
  const menuDishes = await getDishes();

  return (
    <main>
      <h1>Our Menu</h1>

      <CategoryBar categories={categories} />
      <FilterShell>
        <Suspense fallback={<p>Loading dishes...</p>}>
          <DishList dishes={menuDishes} />
        </Suspense>
      </FilterShell>

      <Link href="/">Back Home</Link>
    </main>
  );
}