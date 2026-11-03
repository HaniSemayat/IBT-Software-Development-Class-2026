"use client";

import { signOut } from "../app/actions";
import { useCart, useFavorites } from "../app/Providers";

export default function SignOutButton({ className = "", children = "Sign Out" }) {
  const { clearCart } = useCart();
  const { clearFavorites } = useFavorites();

  function handleSignOut() {
    clearCart();
    clearFavorites();

    try {
      localStorage.removeItem("addiseats-favorites");
    } catch {
      // Continue signing out even if browser storage is unavailable.
    }
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        onClick={handleSignOut}
        className={className}
      >
        {children}
      </button>
    </form>
  );
}
