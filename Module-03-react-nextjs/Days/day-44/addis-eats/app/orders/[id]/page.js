import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { getOrderForUser } from "../../../lib/orders";
import OrderStatus from "./OrderStatus";

export const metadata = {
  title: "Order Details",
  description: "View the status of your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
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
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Addis Eats
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Order #{order.id}
      </h1>

      <OrderStatus id={id} initial={order} />
    </main>
  );
}
