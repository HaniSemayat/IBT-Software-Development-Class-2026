import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <CheckoutForm />
    </main>
  );
}