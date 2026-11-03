"use client";

import { useState } from "react";
import Link from "next/link";

import { signOut } from "./actions";

const linkClass =
  "block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand/5 hover:text-brand";

export default function MobileNav({ session, isStaff }) {
  const [open, setOpen] = useState(false);

  const links = isStaff
    ? [
        ["Admin Panel", "/admin"],
        ["Dashboard", "/dashboard"],
        ["All Orders", "/admin/orders"],
        ["Kitchen", "/kitchen"],
        ["Customer Menu", "/menu"],
      ]
    : [
        ["Home", "/"],
        ["Menu", "/menu"],
        ["Favorites", "/favorites"],
        ["Cart", "/cart"],
        ["Checkout", "/checkout"],
        ...(session ? [["My Orders", "/orders"]] : []),
        ...(!session ? [["Create Account", "/signup"]] : []),
      ];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {open ? (
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[65px] z-40 cursor-default bg-black/20"
          />

          <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-xl">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {label}
              </Link>
            ))}

            {session ? (
              <>
                <div className="my-2 border-t border-border" />
                <div className="px-4 py-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {session.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {session.email}
                  </p>
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className={`${linkClass} w-full cursor-pointer text-left text-danger hover:bg-danger/5 hover:text-danger`}
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-lg bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Sign In
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

