"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <main>
      <h1>Checkout</h1>

      <p>Review your order before placing it.</p>

      <button onClick={() => router.push("/menu")}>
        Back to Menu
      </button>

      <br />

      <Link href="/cart">Back to Cart</Link>
    </main>
  );
}