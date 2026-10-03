import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
          Addis Eats
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Checkout
        </h1>

        <p className="mt-3 text-gray-200">
          Enter your delivery details to place your order.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <CheckoutForm />
      </div>
    </main>
  );
}
