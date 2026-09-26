import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cookieStore = await cookies();

  // Reading the session cookie makes this route request-dependent.
  const session = cookieStore.get("session");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <p className="mt-2">
        {session ? "Session found." : "No active session found."}
      </p>

      <div className="mt-4 flex gap-4">
        <Link href="/cart">Back to Cart</Link>
        <Link href="/menu">Back to Menu</Link>
      </div>
    </main>
  );
}