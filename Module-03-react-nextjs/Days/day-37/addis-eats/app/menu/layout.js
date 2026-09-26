"use client";

import Link from "next/link";
import { useState } from "react";

export default function MenuLayout({ children }) {
  const [count, setCount] = useState(0);

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

        <div className="mt-8 border-t pt-4">
          <p>Menu counter: {count}</p>

          <button
            onClick={() => setCount(count + 1)}
            className="mt-2 border px-3 py-1"
          >
            +1
          </button>
        </div>
      </aside>

      <section className="flex-1 p-6">
        {children}
      </section>
    </div>
  );
}