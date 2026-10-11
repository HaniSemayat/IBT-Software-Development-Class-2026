import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getOrdersByUser } from "../../lib/orders";
import Link from "next/link";

export const metadata = {
  title: "My Orders",
  description: "View your Addis Eats order history.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/orders");
  }

  const orders = await getOrdersByUser(session.id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">
        My Orders
      </h1>

      <p className="mt-2 text-white">
        Orders belonging to {session.name}.
      </p>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-lg bg-white p-6 text-gray-700 shadow-sm">
          You have no orders yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border bg-white p-5 transition hover:border-orange-500"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-950">
                  Order #{order.id}
                </p>

                <span className="text-sm font-bold capitalize text-orange-600">
                  {order.status}
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-800">
                {order.area}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
