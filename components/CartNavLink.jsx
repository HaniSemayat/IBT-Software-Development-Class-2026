"use client";

import Link from "next/link";
import { useCart } from "../app/Providers";

export default function CartNavLink() {
  const { items } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <span>Cart</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-xs font-bold leading-none text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
