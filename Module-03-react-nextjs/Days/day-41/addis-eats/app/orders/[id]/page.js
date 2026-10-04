import { notFound } from "next/navigation";
import { getOrder } from "../../../lib/orders";

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

      <section className="mt-8 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm">
        <p>
          <strong>Name:</strong> {order.name}
        </p>

        <p className="mt-2">
          <strong>Phone:</strong> {order.phone}
        </p>

        <p className="mt-2">
          <strong>Delivery Area:</strong> {order.area}
        </p>

        <p className="mt-2">
          <strong>Status:</strong> {order.status}
        </p>
      </section>
    </main>
  );
}
