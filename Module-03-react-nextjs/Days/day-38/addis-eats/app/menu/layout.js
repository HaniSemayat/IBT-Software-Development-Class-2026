import Link from "next/link";
import MenuCounter from "./MenuCounter";

export default function MenuLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 border-r p-4">
        <h2 className="mb-4 font-bold">Categories</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/menu">All</Link>
          <Link href="/menu?category=ethiopian">Ethiopian</Link>
          <Link href="/menu?category=pizza">Pizza</Link>
          <Link href="/menu?category=burgers">Burgers</Link>
          <Link href="/menu?category=drinks">Drinks</Link>
        </nav>

        <MenuCounter />
      </aside>

      <section className="flex-1 p-6">
        {children}
      </section>
    </div>
  );
}