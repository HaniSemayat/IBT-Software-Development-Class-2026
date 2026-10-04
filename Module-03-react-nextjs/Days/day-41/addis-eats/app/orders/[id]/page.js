import { notFound } from "next/navigation";
import { getOrder } from "../../../lib/orders";
import OrderStatus from "./OrderStatus";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

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
