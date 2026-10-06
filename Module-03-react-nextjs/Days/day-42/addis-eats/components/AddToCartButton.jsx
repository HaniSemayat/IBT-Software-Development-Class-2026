"use client";

import { useCart } from "../app/Providers";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const router = useRouter();

  function handleAddToCart() {
    addToCart(dish);
    router.push("/cart");
  }

  return (
    <button
      onClick={handleAddToCart}
      className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
    >
      Add to Cart
    </button>
  );
}
