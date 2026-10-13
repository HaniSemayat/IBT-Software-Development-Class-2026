import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout",
  description: "Enter your delivery details to complete your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/checkout");
  }

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
