import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { getOrderForUser } from "../../../lib/orders";
import OrderStatus from "./OrderStatus";

export const metadata = {
  title: "Order Details",
  description: "Track your Addis Eats order and delivery status.",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  const order = await getOrderForUser(id, session.id);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
        >
          Back to my orders
        </Link>

        <header className="mb-8 mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Addis Eats / Order tracking
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your order, in progress
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Follow your order status and check the delivery information below.
          </p>
        </header>

        <OrderStatus id={id} initial={order} />
      </div>
    </main>
  );
}
