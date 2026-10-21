
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
      className={`inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        added
          ? "bg-success hover:bg-success"
          : "bg-brand hover:bg-brand-hover"
      }`}
      aria-live="polite"
    >
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
