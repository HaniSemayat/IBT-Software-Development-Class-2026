"use client";

import { useEffect, useState } from "react";
import { useCart } from "../app/Providers";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;

    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAddToCart() {
    addToCart(dish);
    setAdded(true);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="cursor-pointer rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 active:scale-95"
      aria-live="polite"
    >
      {added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
