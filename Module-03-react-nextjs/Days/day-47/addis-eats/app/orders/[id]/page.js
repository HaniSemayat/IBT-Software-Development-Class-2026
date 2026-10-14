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
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <a
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
        >
          <span aria-hidden="true">&larr;</span>
          Back to my orders
        </a>

        <header className="mb-8 mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Addis Eats / Order tracking
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Your order, in progress
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Follow your order status and check the delivery information below.
          </p>
        </header>

        <OrderStatus id={id} initial={order} />
      </div>
    </main>
  );
}
