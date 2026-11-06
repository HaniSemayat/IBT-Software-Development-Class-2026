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
    <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Addis Eats
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-3 max-w-xl leading-7 text-muted">
          You are almost there. Confirm your order and enter your delivery
          details to enjoy your meal.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-8">
        <CheckoutForm />
      </section>
    </main>
  );
}