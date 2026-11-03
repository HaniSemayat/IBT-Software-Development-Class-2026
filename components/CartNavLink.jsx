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
      className="relative inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg px-2 text-foreground transition-colors hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden text-sm font-medium lg:inline">Cart</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 inline-flex min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-bold leading-none text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

