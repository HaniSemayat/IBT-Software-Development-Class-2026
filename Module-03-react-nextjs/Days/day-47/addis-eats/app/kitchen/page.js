import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getAllOrders } from "../../lib/orders";
import { updateOrderStatus } from "../actions";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Staff-only Addis Eats kitchen dashboard.",
  robots: { index: false, follow: false },
};

const statuses = [
  { value: "placed", label: "Placed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/kitchen");

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Access denied</h1>
        <p className="mt-3 text-gray-300">
          You do not have permission to access the kitchen.
        </p>
      </main>
    );
  }

  const orders = await getAllOrders();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Addis Eats
      </p>

      <h1 className="mt-2 text-4xl font-bold text-white">
        Kitchen Dashboard
      </h1>

      <p className="mt-3 text-gray-300">
        Welcome, {session.name}. Manage incoming orders and update customers live.
      </p>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-300">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-gray-700 bg-gray-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Order #{order.id} · {order.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-300">
                    {order.area} · {order.phone}
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                  </p>
                  <p className="mt-2 font-semibold text-orange-400">
                    ETB {order.total}
                  </p>
                </div>

                <span className="rounded-full bg-gray-800 px-3 py-1 text-sm capitalize text-white">
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>

              <form
                action={updateOrderStatus}
                className="mt-5 flex flex-wrap items-end gap-3 border-t border-gray-700 pt-4"
              >
                <input type="hidden" name="orderId" value={order.id} />

                <div className="min-w-48 flex-1">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="mb-1 block text-sm text-gray-300"
                  >
                    Update status
                  </label>
                  <select
                    id={`status-${order.id}`}
                    name="status"
                    defaultValue={order.status}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-500"
                >
                  Save status
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </main>
  );
}