import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Addis Eats</h1>

      <p>Discover delicious food in Addis Ababa.</p>

      <nav>
        <Link href="/menu">Menu</Link>
        {" | "}
        <Link href="/cart">Cart</Link>
        {" | "}
        <Link href="/checkout">Checkout</Link>
      </nav>
    </main>
  );
}