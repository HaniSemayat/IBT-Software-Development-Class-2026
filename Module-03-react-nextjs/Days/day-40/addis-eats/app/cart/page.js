import Link from "next/link";

export default function CartPage() {
  return (
    <main>
      <h1>Your Cart</h1>
      <p>Your cart is currently empty.</p>

      <Link href="/menu">Continue Shopping</Link>
      {" | "}
      <Link href="/checkout">Go to Checkout</Link>
    </main>
  );
}