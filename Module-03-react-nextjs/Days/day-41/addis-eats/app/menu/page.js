import Link from "next/link";
import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";

const categories = [
  "All",
  "Ethiopian",
  "Pizza",
  "Burgers",
  "Drinks",
];

export default function MenuPage() {
  return (
    <main>
      <h1>Our Menu</h1>

      <CategoryBar categories={categories} />
      <SearchBox />

      <Link href="/">Back Home</Link>
    </main>
  );
}
